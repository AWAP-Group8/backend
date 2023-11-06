const jwt = require('jsonwebtoken');
const secret = 'kms fast'
const createToken = payload => jwt.sign(payload, secret, {
    expiresIn: '7d',
    algorithm: 'HS256'
})


module.exports = { createToken };