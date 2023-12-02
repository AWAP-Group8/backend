const { asyncQuery } = require('../modules/database')
const lockerService = {}

lockerService.locker = async (req, res) => {
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

lockerService.pickupParcel = async (req, res) => {
  const { pickupLocker, pickupCode } = req.query
  const findByLocker = `select * from locker_management where locker = '${pickupLocker}' and code IS NOT NULL and parcel_status = 'waiting for picking up'`
  const findByCode = `select * from locker_management where code = '${pickupCode}' and parcel_status = 'waiting for picking up'`
  const findSql = `select * from locker_management where locker = '${pickupLocker}' and code = '${pickupCode}' and parcel_status = 'waiting for picking up'`
  const [lockerRes, codeRes, result] = await Promise.all(
    [
      asyncQuery(findByLocker),
      asyncQuery(findByCode),
      asyncQuery(findSql)
    ]
  )
  const data = {}
  console.log(lockerRes, codeRes)
  if (result.length === 0) {
    data.success = false
    if (lockerRes.length > 0) {
      data.code = 'WRONG CODE '
      data.msg = 'You have entered the incorrect code'
    } else if (codeRes.length !== 0) {
      // don't tell user the right locker cause there maybe 2+ lockers matched
      data.code = 'WRONG LOCKER'
      data.msg = 'You have choosed the incorrect locker'
    } else {
      data.code = 'WRONG INFO'
      data.msg = 'You maybe entered wrong info'
    }
    res.send(data)
    return
  }
  data.succees = true
  data.msg = `DOOR ${result[0].cabinet} OPEN FOR PICKUP`
  data.data = {
    cabinet: result[0].cabinet
  }
  res.send(data)
}

lockerService.closeCabinetDoorPickup = async (req, res) => {
  const { pickupLocker, pickupCabinet } = req.body
  const findSql = `select tracking_number from locker_management where locker = '${pickupLocker}' and cabinet = '${pickupCabinet}'`
  const result = await asyncQuery(findSql)
  const tracking_number = result[0].tracking_number
  const resetCabinet = `update locker_management set cabinet_status = 'free', code = NULL, parcel_status = NULL, tracking_number = NULL, reserved = 0 where locker = '${pickupLocker}' and cabinet = '${pickupCabinet}'`
  const setParcelStatus = `update parcels_management set parcel_status = 'picked up successfully' where tracking_number = '${tracking_number}'`
  await Promise.all([
    asyncQuery(resetCabinet),
    asyncQuery(setParcelStatus)
  ])
  const data = {
    succees: true,
    msg: 'close successfully'
  }
  res.send(data)
}

lockerService.sendParcel = async (req, res) => {
  const { pickupLocker, pickupCode } = req.query
  const findByLocker = `select * from locker_management where locker = '${pickupLocker}' and code IS NOT NULL and parcel_status = 'waiting for sending'`
  const findByCode = `select * from locker_management where code = '${pickupCode}' and parcel_status = 'waiting for sending'`
  const findSql = `select * from locker_management where locker = '${pickupLocker}' and code = '${pickupCode}' and parcel_status = 'waiting for sending'`
  const [lockerRes, codeRes, result] = await Promise.all(
    [
      asyncQuery(findByLocker),
      asyncQuery(findByCode),
      asyncQuery(findSql)
    ]
  )
  const data = {}
  if (result.length === 0) {
    data.success = false
    if (lockerRes.length > 0) {
      data.code = 'WRONG CODE '
      data.msg = 'You have entered the incorrect code'
    } else if (codeRes.length !== 0) {
      // don't tell user the right locker cause there maybe 2+ lockers matched
      data.code = 'WRONG LOCKER'
      data.msg = 'You have choosed the incorrect locker'
    } else {
      data.code = 'WRONG INFO'
      data.msg = 'You maybe entered wrong info'
    }
    res.send(data)
    return
  }
  data.succees = true
  data.msg = `DOOR ${result[0].cabinet} OPEN FOR DROP OFF`
  data.data = {
    cabinet: result[0].cabinet
  }
  res.send(data)
}

lockerService.closeCabinetDoorSend = async (req, res) => {
  const { pickupLocker, pickupCabinet } = req.body
  const findSql = `select tracking_number from locker_management where locker = '${pickupLocker}' and cabinet = '${pickupCabinet}'`
  const result = await asyncQuery(findSql)
  const tracking_number = result[0].tracking_number
  const resetCabinet = `update locker_management set cabinet_status = 'full', parcel_status = 'waiting for dropping off' where locker = '${pickupLocker}' and cabinet = '${pickupCabinet}'`
  const setParcelStatus = `update parcels_management set parcel_status = 'waiting for dropping off' where tracking_number = '${tracking_number}'`
  await Promise.all([
    asyncQuery(resetCabinet),
    asyncQuery(setParcelStatus)
  ])
  const data = {
    succees: true,
    msg: 'close successfully'
  }
  res.send(data)
}

module.exports = lockerService