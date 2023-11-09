const parcelService = {}
const database = require('../modules/database')
const connection = database.getConnection()
const util = require('util')
const { resolveToken } = require('../utils/jwt')
const asyncQuery = util.promisify(connection.query).bind(connection)

parcelService.send = async (req, res) => {
    const {
        sender_name,
        sender_email,
        pickup_locker,
        receiver_name,
        receiver_email,
        length,
        width,
        height,
        mass,
        sender_locker,
    } = req.body

    const tracking_number = orderTracking()
    const create_time = Date.now()
    const insertObj = {
        sender_name,
        sender_email,
        pickup_locker,
        receiver_name,
        receiver_email,
        length,
        width,
        height,
        mass,
        sender_locker,
        tracking_number,
        create_time,
    }
    const keyArr = Reflect.ownKeys(insertObj)
    const valueArr = keyArr.map(key => `'${insertObj[key]}'`)
    // [1,2,3] => '1,2,3'
    const insertSql = `insert into parcel (${keyArr.join(',')}) values (${valueArr.join(',')})`

    function setTimeFormt(date) {
        return date < 10 ? '0' + date : date;
    }
    function orderTracking() {
        const now = new Date()
        let month = now.getMonth() + 1
        let day = now.getDate()
        let hour = now.getHours()
        let minutes = now.getMinutes()
        let seconds = now.getSeconds()
        month = setTimeFormt(month)
        day = setTimeFormt(day)
        hour = setTimeFormt(hour)
        minutes = setTimeFormt(minutes)
        seconds = setTimeFormt(seconds)
        let tracking_number = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + Math.floor(Math.random() * 1000000)
        return tracking_number
    }

    await asyncQuery(insertSql)
    // todo
    const data = {}
    data.succees = true
    data.msg = 'send a parcel sucessfully'
    res.send(data)
}

parcelService.findAll = async (req, res) => {
    const {
        start
    } = req.query
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcel where sender_email = '${email}' or receiver_email = '${email}' 
    order by createTime desc limit ${start}, 10`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        list: result
    }
    res.send(data)
}

parcelService.findSent = async (req, res) => {
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcel where sender_email = '${email}' 
    order by createTime desc`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        list: result
    }
    res.send(data)
}

parcelService.findReceived = async (req, res) => {
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcel where receiver_email = '${email}' 
    order by createTime desc`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        list: result
    }
    res.send(data)
}

module.exports = parcelService