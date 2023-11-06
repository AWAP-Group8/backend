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
            data.code = 'DATABASE INSERTED FAILED'
            data.msg = 'database inserted failed'
        } else {
            data.success = true
            data.msg = 'database inserted successfully'
        }
        res.send(data)
    })
}

// Login
userService.login = (req, res) => {
    const { username, password } = req.query
    const sql = `select * from user where username = '${username}' or stuNo = '${username}'`
    connection.query(sql, (err, result) => {
        const data = {}
        if (err) {
            setInternalError(data)
        } else {
            // result.length === 0, means account does not exit
            if (result.length === 0) {
                setData(data, false, 'account does not exist', 'Account does not exist!')
                data.data = null
                res.send(data)
                return
            }
            const truePass = deGenSign(result[0].password)
            if (truePass === password) {
                data.success = true
                data.msg = 'login successfully'
                const token = createToken(req.query)
                delete result[0].password
                data.data = {
                    token,
                    info: result[0]
                }
            } else {
                data.success = false
                data.msg = 'incorrect password'
                data.data = null
            }
        }
        res.send(data)
    })
}

module.exports = userService