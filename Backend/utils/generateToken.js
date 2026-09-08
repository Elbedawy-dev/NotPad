const JWT = require('jsonwebtoken')

const generateToken = (id) => {
    return JWT.sign({id} , process.env.JWT_SECRET, {expiresIn: '7d' })
}

module.exports = generateToken