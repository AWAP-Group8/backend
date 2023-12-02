const express = require("express")
const router = express.Router()
const driverService = require('../services/driverService')

router.post('/register',
    (req, res) => {
      driverService.register(req, res)
    },
)

router.get('/login',
    (req, res) => {
      driverService.login(req, res)
    }
)

router.get('/availableCabinets',
    (req, res) => {
      driverService.availableCabinets(req, res)
    }
)

router.get('/canDeliverCabinets',
    (req, res) => {
      driverService.canDeliverCabinets(req, res)
    }
)

router.post('/pickupParcel',
    (req, res) => {
      driverService.pickupParcel(req, res)
    }
)

router.post('/deliverParcels',
    (req, res) => {
      driverService.deliverParcels(req, res)
    }
)


module.exports = router