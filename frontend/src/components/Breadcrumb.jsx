import PropTypes from "prop-types";
import styles from "../pages/CSS/AboutUs.module.css";

const Breadcrumb = ({ pageTitle = "PAGE TITLE", breadcrumbNav = [] }) => {
  return (
    <div className={styles.breadcrumbSection}>
      {/* Dynamic Page Title */}
      <h1 className={styles.pageTitle}>{pageTitle}</h1>
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          {breadcrumbNav.map((item, index) => (
            <li key={index}>
              {item.current ? (
                <div className={styles.breadcrumbCurrent}>
                  <svg
                    className={styles.breadcrumbArrow}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span>{item.label}</span>
                </div>
              ) : (
                <a href={item.link} className={styles.breadcrumbLink}>
                  <svg
                    className={styles.breadcrumbIcon}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 1 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

Breadcrumb.propTypes = {
  pageTitle: PropTypes.string,
  breadcrumbNav: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
      current: PropTypes.bool,
    })
  ),
};

export default Breadcrumb;
