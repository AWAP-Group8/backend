const parcelService = {}
const { asyncQuery } = require('../modules/database')

parcelService.send = async (req, res) => {
    const {
        sender_name,
        sender_email,
        pickup_locker,
        pickup_cabinet,
        receiver_name,
        receiver_email,
        length,
        width,
        height,
        mass,
        sender_locker,
        sender_cabinet,
    } = req.body

    const tracking_number = orderTracking()
    const create_time = Date.now()
    const code = await generateCode(pickup_locker)
    const insertObj = {
        sender_name,
        sender_email,
        pickup_locker,
        pickup_cabinet,
        receiver_name,
        receiver_email,
        length,
        width,
        height,
        mass,
        sender_locker,
        sender_cabinet,
        tracking_number,
        create_time,
        parcel_status: 'waiting for sending',
        sender_code: code,
    }
    const keyArr = Reflect.ownKeys(insertObj)
    const valueArr = keyArr.map(key => `'${insertObj[key]}'`)
    // [1,2,3] => '1,2,3'
    const insertSql = `insert into parcels_management (${keyArr.join(',')}) values (${valueArr.join(',')})`
    const updateLockerSql = `update locker_management set code = '${code}' where locker = '${sender_locker}' and cabinet = '${sender_cabinet}'`
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

    await Promise.allSettled([
        asyncQuery(insertSql),
        asyncQuery(updateLockerSql)
    ])
    const data = {}
    data.success = true
    data.msg = 'send a parcel sucessfully'
    data.data = {
        code
    }
    res.send(data)
}

async function generateCode(pickup_locker) {
    let randomCode
    let res
    do {
        randomCode = Math.floor(Math.random() * 9000) + 1000
        const findSql = `select code from locker_management where locker = '${pickup_locker}' and code = '${randomCode}'`
        res = await asyncQuery(findSql)
    } while (res.length > 0)
    return randomCode
}

parcelService.findEmptyCabinet = async (req, res) => {
    const {
        locker,
    } = req.query
    const findSql = `select cabinet from locker_management where locker = '${locker}' and cabinet_status = 'free' and code is null`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        list: result.map(data => {
            const { cabinet } = data
            return {
                value: cabinet,
                label: cabinet
            }
        })
    }
    res.send(data)
}

parcelService.findAll = async (req, res) => {
    const {
        start
    } = req.query
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcels_management where sender_email = '${email}' or receiver_email = '${email}' order by create_time desc limit ${start * 10}, 10`
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
    const {
        start
    } = req.query
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcels_management where sender_email = '${email}' order by create_time desc limit ${start * 10}, 10`
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
    const {
        start
    } = req.query
    const email = resolveToken(req.headers.token).email
    const findSql = `select * from parcels_management where receiver_email = '${email}' order by create_time desc limit ${start * 10}, 10`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        list: result
    }
    res.send(data)
}

parcelService.findAllCount = async (req, res) => {
    const email = resolveToken(req.headers.token).email
    const findSql = `select count(*) as count from parcels_management where sender_email = '${email}' or receiver_email = '${email}'`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        count: result[0].count
    }
    res.send(data)
}

parcelService.findSentCount = async (req, res) => {
    const email = resolveToken(req.headers.token).email
    const findSql = `select count(*) as count from parcels_management where sender_email = '${email}'`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        count: result[0].count
    }
    res.send(data)
}

parcelService.findReceivedCount = async (req, res) => {
    const email = resolveToken(req.headers.token).email
    const findSql = `select count(*) as count from parcels_management where receiver_email = '${email}'`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        count: result[0].count
    }
    res.send(data)
}

parcelService.Locker = async (req, res) => {
    const findSql = `select locker from locker_location`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        locker: result.map(data => {
            const { locker } = data
            return {
                value: locker,
                label: locker
            }
        })
    }
    res.send(data)
}

parcelService.findTrackingNumber = async (req, res) => {
    const { tracking_number } = req.query
    const findSql = `select * from parcels_management where tracking_number = '${tracking_number}'`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        res: result[0]
    }
    res.send(data)
}

parcelService.findHistory = async (req, res) => {
    const { tracking_number } = req.query
    const findSql = `select * from parcel_histories where tracking_number = '${tracking_number}' order by create_time desc`
    const result = await asyncQuery(findSql)
    const data = {}
    data.succees = true
    data.msg = 'find successfully'
    data.data = {
        historyList: result
    }
    res.send(data)
}


module.exports = parcelService