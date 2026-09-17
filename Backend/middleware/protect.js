const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    // Read token from Authorization header (Bearer token strategy for cross-origin support)
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Fallback: still support cookie-based token (for local dev / backward compat)
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' })
    }
}

module.exports = protect