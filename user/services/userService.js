const userService = {}
const database = require('../modules/database')
const { createToken } = require('../utils/jwt')
const connection = database.getConnection()
const util = require('util')
const asyncQuery = util.promisify(connection.query).bind(connection)

const crypto = require("crypto")
const genSign = (orignValue) => {
    let sign = ''
    const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8')
    const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8')
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    sign += cipher.update(orignValue, 'utf8', 'hex')
    sign += cipher.final('hex')
    return sign
}
const deGenSign = (sign) => {
    let src = ''
    const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8')
    const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8')
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    src += decipher.update(sign, 'hex', 'utf8')
    src += decipher.final('utf8')
    return src
}

// Registration
userService.register = async (req, res) => {
    let { username, password, email } = req.body
    // if username have already exit
    const findUserSql = `select username from user where username = '${username}'`
    const userList = await asyncQuery(findUserSql)
    // userList.length > 0 means username duplicating
    if (userList.length > 0) {
        const data = {}
        data.success = false
        data.code = 'DUPLICATE USER'
        data.msg = 'duplicate user'
        res.send(data)
        return
    }

    // if email have already exit
    const findEmailSql = `select email from user where email = '${email}'`
    const emailList = await asyncQuery(findEmailSql)
    // emailList.length > 0 means email has been registered
    if (emailList.length > 0) {
        const data = {}
        data.success = false
        data.code = 'DUPLICATE EMAIL'
        data.msg = 'duplicate email'
        res.send(data)
        return
    }

    password = genSign(password)
    const insertSql = `insert into user (username, password, email) values ('${username}', '${password}', '${email}')`
    connection.query(insertSql, (err, result) => {
        const data = {}
        if (err) {
            console.log(err)
            data.success = false
            data.code = 'REGISTERED FAILED'
            data.msg = 'registered failed'
        } else {
            data.success = true
            data.code = 'REGISTERED SUCCESSFULLY'
            data.msg = 'registered successfully'
        }
        res.send(data)
    })
}

// Login
userService.login = (req, res) => {
    const { username, password } = req.query
    const sql = `select * from user where username = '${username}' or email = '${username}'`
    connection.query(sql, (err, result) => {
        const data = {}
        if (err) {
            data.success = false
            data.msg = 'login failed'
            data.code = 'LOGIN FAILED'
            data.data = null
        } else {
            // result.length === 0, means account does not exit
            if (result.length === 0) {
                data.success = false
                data.msg = 'account does not exist'
                data.code = 'Account DOES NOT EXIST'
                data.data = null
                res.send(data)
                return
            }
            const truePass = deGenSign(result[0].password)
            if (truePass === password) {
                data.success = true
                data.msg = 'login successfully'
                data.code = 'LOGIN SUCCESSFULLY'
                const token = createToken({
                    username: result[0].username,
                    email: result[0].email
                })
                delete result[0].password
                data.data = {
                    token,
                    info: result[0]
                }
            } else {
                data.success = false
                data.msg = 'incorrect password'
                data.code = 'INCORRECT PASSWORD'
                data.data = null
            }
        }
        res.send(data)
    })
}

module.exports = userService