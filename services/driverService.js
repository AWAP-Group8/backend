const driverService = {}
const { createToken, generateCode } = require('../utils')
const { asyncQuery } = require('../modules/database')
const { sendMail } = require('../mail')

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

// Registration, this is not necessary based on requirements, if you don't want just ignore the registration
// this registration will crypto driver's password, which is more secure
driverService.register = async (req, res) => {
  let { driver_email, password } = req.body
  const findDriverSql = `select driver_email from driver_management where driver_email = '${driver_email}'`
  const driverList = await asyncQuery(findDriverSql)
  if (driverList.length > 0) {
    const data = {}
    data.success = false
    data.code = 'DUPLICATE DRIVER'
    data.msg = 'duplicate driver'
    res.send(data)
    return
  }

  password = genSign(password)
  const insertSql = `insert into driver_management (driver_email, password) values ('${driver_email}', '${password}')`
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

// 1. Login
driverService.login = (req, res) => {
  const { driver_email, password } = req.query
  const sql = `SELECT * FROM driver_management WHERE driver_email = '${driver_email}'`
  connection.query(sql, (err, result) => {
    const data = {}
    if (err) {
      data.success = false
      data.msg = 'login failed'
      data.code = 'LOGIN FAILED'
      data.data = null
      console.log(err)
    } else {
      // No info found, return an error response
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
          driver_email
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

// 2.for the driver to see which cabinets are free at the selected parcel locker
driverService.availableCabinets = async (req, res) => {
  const { locker } = req.query
  const findSql = `SELECT cabinet FROM locker_management WHERE locker = '${locker}' AND cabinet_status = 'free'`
  const result = await asyncQuery(findSql)
  const cabinets = result.map(item => item.cabinet)
  const data = {
    success: true,
    msg: 'find successfully',
    data: {
      cabinets
    }
  }
  res.send(data)
};

// pickup parcels
// 3.displays which cabinets in location have parcel to be picked up by the driver for delivery
driverService.canDeliverCabinets = async (req, res) => {
  const { locker } = req.query
  const findSql = `SELECT cabinet FROM locker_management WHERE locker = '${locker}' AND parcel_status = 'waiting for dropping off'`
  const result = await asyncQuery(findSql)
  const cabinets = result.map(item => item.cabinet)
  const data = {
    success: true,
    msg: 'find successfully',
    data: {
      cabinets
    }
  }
  res.send(data)
}

// pickup parcels
// 4.open the cabinet and pick up the parcel
// 5.update the status of 'full' sender_cabinet to 'free', and update the status of 'waiting for sending' parcel_status to 'during transportation'
driverService.pickupParcel = async (req, res) => {
  const { selectedLocker, selectedCabinet, code } = req.body;
  const findSql = `SELECT code, tracking_number FROM locker_management WHERE locker = '${selectedLocker}' AND cabinet = '${selectedCabinet}'`
  const result = await asyncQuery(findSql)
  const data = {}
  if (result.length === 0) {
    data.success = false
    data.msg = 'please select the right locker and cabinet'
    data.code = 'WRONG LOCKER AND CABINET'
    res.send(data)
    return
  }
  const rightCode = result[0].code
  const tracking_number = result[0].tracking_number
  if (code !== rightCode) {
    data.success = false
    data.msg = 'wrong code'
    data.code = 'WRONG CODE'
    res.send(data)
    return
  }
  const updateSql = `update locker_management set cabinet_status = 'free', code = NULL, parcel_status = NULL, tracking_number = NULL, reserved = 0 where locker = '${selectedLocker}' and cabinet = '${selectedCabinet}'`
  const updateParcelSql = `update parcels_management set parcel_status = 'during transportation' where tracking_number = '${tracking_number}'`
  await Promise.all([
    asyncQuery(updateSql),
    asyncQuery(updateParcelSql)
  ])
  data.success = true
  data.msg = 'pickup successfully'
  res.send(data)
}

// deliver parcels
// 6.open the cabinet and put the parcel in
// 7.update the status of 'free' pickup_cabinet to 'full', and update the status of 'during transportation' parcel_status to 'waiting for picking up'
driverService.deliverParcels = async (req, res) => {
  const { selectedLocker, selectedCabinet } = req.body;
  const findTrackingCodeSql = `SELECT tracking_number FROM locker_management WHERE locker = '${selectedLocker}' AND cabinet = '${selectedCabinet}'`
  const result = await asyncQuery(findTrackingCodeSql)
  const data = {}
  if (result.length === 0) {
    data.success = false
    data.msg = 'please select the right locker and cabinet'
    data.code = 'WRONG LOCKER AND CABINET'
    res.send(data)
    return
  }
  const tracking_number = result[0].tracking_number
  const code = await generateCode(selectedLocker)
  const findSql = `select * from parcels_management where tracking_number = '${tracking_number}'`
  const parcelRes = await asyncQuery(findSql)
  const receiver_email = parcelRes[0].receiver_email
  const arrive_time = Date.now()
  const updateSql = `update locker_management set cabinet_status = 'full', code = '${code}', parcel_status = 'waiting for picking up' where locker = '${selectedLocker}' and cabinet = '${selectedCabinet}'`
  const updateParcelSql = `update parcels_management set parcel_status = 'waiting for picking up', pickup_code = '${code}', arrive_time = '${arrive_time}' where tracking_number = '${tracking_number}'`
  await Promise.all([
    asyncQuery(updateSql),
    asyncQuery(updateParcelSql)
  ])
  await sendMail(receiver_email, code)
  data.success = true
  data.msg = 'pickup successfully'
  res.send(data)
};


module.exports = driverService