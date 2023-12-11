const express = require("express")
const router = express.Router()
const robotService = require('../services/robotService')
const parcelService = require('../services/parcelService')

router.get('/getAllUsers',
    (req, res) => {
        robotService.getAllUsers(req, res)
    },
)

router.post('/addTestParcel',
    (req, res) => {
        parcelService.send(req, res)
    },
)

router.get('/findEmptyCabinet',
    (req, res) => {
        parcelService.findEmptyCabinet(req, res)
    },
)

router.get('/findAllParcels',
    (req, res) => {
        robotService.findAllParcels(req, res)
    },
)

module.exports = router