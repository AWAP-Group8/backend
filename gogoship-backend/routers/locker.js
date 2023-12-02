const express = require("express")
const router = express.Router()
const lockerService = require('../services/lockerService')

router.get('/getLocker',
    (req, res) => {
      lockerService.locker(req, res)
    },
)

router.get('/pickupParcel',
    (req, res) => {
      lockerService.pickupParcel(req, res)
    },
)

router.post('/closeCabinetDoorPickup',
    (req, res) => {
      lockerService.closeCabinetDoorPickup(req, res)
    },
)

router.get('/sendParcel',
    (req, res) => {
      lockerService.sendParcel(req, res)
    },
)

router.post('/closeCabinetDoorSend',
    (req, res) => {
      lockerService.closeCabinetDoorSend(req, res)
    },
)

module.exports = router