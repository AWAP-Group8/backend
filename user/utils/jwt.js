const jwt = require('jsonwebtoken');
const secret = 'pkt-management'
const createToken = payload => jwt.sign(payload, secret, {
    expiresIn: '7d',
    algorithm: 'HS256'
})
const resolveToken = token => jwt.verify(token, secret, (err, res) => {
    if (!err) return res
})

module.exports = { createToken, resolveToken };