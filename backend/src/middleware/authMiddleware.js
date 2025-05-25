const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const verifyJWT = (req, scopes, schema) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, secretKey);
            req.user = user;
            return true;
        } catch (err) {
            console.error('JWT VERIFICATION ERROR:', err);
            return false;
        }
    } else {
        console.error('AUTH HEADER MISSING');
        return false;
    }
};

const verifyAdminJWT = (req, scopes, schema) => {
    if (verifyJWT(req, scopes, schema)) {
        if (req.user && req.user.isAdmin) {
            console.log('User is admin:', req.user);
            return true;
        } else {
            console.log('User is not admin:', req.user);
            throw new Error('Forbidden: User is not admin');
        }
    }
    throw new Error('Unauthorized');
};



module.exports = { verifyJWT, verifyAdminJWT };