#!/usr/bin/env bash
# One-time Azure setup for the Scoop demo. Safe to re-run.
#
# Creates (or updates):
#   - resource group + Container Apps environment (shared with Tapiro)
#   - Container App scoop-api (public, scales to zero, max 1 replica so
#     Socket.io rooms stay on one instance)
#   - Static Web App (Free): scoop-web
#   - a federated credential so GitHub Actions on main can deploy
#
# Needs: az CLI logged in (az login), and these exported in your shell.
# Nothing here is written to disk.
#   MONGO_URI    Atlas connection string ending in /scoopCinema
#   REDIS_URL    rediss://... from Upstash
#   JWT_SECRET   any long random string (openssl rand -hex 32)
# Optional:
#   GHCR_USERNAME, GHCR_TOKEN   only if the GHCR package is private
set -euo pipefail
# Secrets are passed as unquoted lists below. Turn off globbing so
# characters like ? in a connection string are never expanded.
set -f

RG="${RG:-rg-portfolio}"
LOCATION="${LOCATION:-southeastasia}"
SWA_LOCATION="${SWA_LOCATION:-eastasia}"
ENV_NAME="${ENV_NAME:-cae-portfolio}"
REPO="${REPO:-CDevmina/Scoop}"
BRANCH="${BRANCH:-main}"
PLACEHOLDER_IMAGE="mcr.microsoft.com/k8se/quickstart:latest"

for v in MONGO_URI REDIS_URL JWT_SECRET; do
  if [ -z "${!v:-}" ]; then echo "Missing $v" >&2; exit 1; fi
done

az config set extension.use_dynamic_install=yes_without_prompt >/dev/null
SUBSCRIPTION_ID="$(az account show --query id -o tsv)"
TENANT_ID="$(az account show --query tenantId -o tsv)"

echo "== Resource group and Container Apps environment"
az group create -n "$RG" -l "$LOCATION" -o none
if ! az containerapp env show -n "$ENV_NAME" -g "$RG" -o none 2>/dev/null; then
  az containerapp env create -n "$ENV_NAME" -g "$RG" -l "$LOCATION" --logs-destination none -o none
fi

echo "== Static Web App"
az staticwebapp show -n scoop-web -g "$RG" -o none 2>/dev/null ||
  az staticwebapp create -n scoop-web -g "$RG" -l "$SWA_LOCATION" --sku Free -o none
WEB_HOST="$(az staticwebapp show -n scoop-web -g "$RG" --query defaultHostname -o tsv)"

echo "== scoop-api"
SECRETS="mongo-uri=$MONGO_URI redis-url=$REDIS_URL jwt-secret=$JWT_SECRET"
ENVVARS="NODE_ENV=production NODE_PORT=5001 MONGO_URI=secretref:mongo-uri REDIS_URL=secretref:redis-url \
  JWT_SECRET=secretref:jwt-secret FRONTEND_URL=https://$WEB_HOST DEMO_MODE=true"
if az containerapp show -n scoop-api -g "$RG" -o none 2>/dev/null; then
  # shellcheck disable=SC2086
  az containerapp secret set -n scoop-api -g "$RG" --secrets $SECRETS -o none
  # shellcheck disable=SC2086
  az containerapp update -n scoop-api -g "$RG" --set-env-vars $ENVVARS -o none
else
  registry_args=()
  if [ -n "${GHCR_TOKEN:-}" ]; then
    registry_args=(--registry-server ghcr.io --registry-username "$GHCR_USERNAME" --registry-password "$GHCR_TOKEN")
  fi
  # Starts with a placeholder image. The deploy workflow swaps in the real one.
  # shellcheck disable=SC2086
  az containerapp create -n scoop-api -g "$RG" --environment "$ENV_NAME" \
    --image "$PLACEHOLDER_IMAGE" --target-port 5001 --ingress external \
    --cpu 0.25 --memory 0.5Gi --min-replicas 0 --max-replicas 1 \
    --secrets $SECRETS --env-vars $ENVVARS "${registry_args[@]}" -o none
fi
API_FQDN="$(az containerapp show -n scoop-api -g "$RG" --query properties.configuration.ingress.fqdn -o tsv)"

echo "== GitHub Actions login (OIDC)"
APP_NAME="github-deploy-portfolio"
APP_ID="$(az ad app list --display-name "$APP_NAME" --query '[0].appId' -o tsv)"
if [ -z "$APP_ID" ]; then
  APP_ID="$(az ad app create --display-name "$APP_NAME" --query appId -o tsv)"
  az ad sp create --id "$APP_ID" -o none
fi
CRED_NAME="$(echo "$REPO-$BRANCH" | tr '/' '-' | tr '[:upper:]' '[:lower:]')"
if ! az ad app federated-credential list --id "$APP_ID" --query "[?name=='$CRED_NAME']" -o tsv | grep -q .; then
  az ad app federated-credential create --id "$APP_ID" --parameters "{
    \"name\": \"$CRED_NAME\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"repo:$REPO:ref:refs/heads/$BRANCH\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
  }" -o none
fi
az role assignment create --assignee "$APP_ID" --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG" -o none 2>/dev/null || true

cat <<OUT

Done. Add these to GitHub: $REPO > Settings > Secrets and variables > Actions

Variables:
  AZURE_CLIENT_ID=$APP_ID
  AZURE_TENANT_ID=$TENANT_ID
  AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID
  AZURE_RESOURCE_GROUP=$RG
  VITE_API_URL=https://$API_FQDN

Secrets:
  SWA_TOKEN=\$(az staticwebapp secrets list -n scoop-web -g $RG --query properties.apiKey -o tsv)
  MONGO_URI (same value as above)

Site: https://$WEB_HOST
OUT
