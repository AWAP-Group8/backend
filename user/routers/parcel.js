const express = require("express")
const router = express.Router()
const parcelService = require('../services/parcelService')
const { resolveToken } = require('../utils/jwt')

router.post('/send',
    (req, res) => {
        parcelService.send(req, res)
    },
)

router.get('/test', (req, res) => {
    console.log(req.headers.token)
    res.send(resolveToken(req.headers.token))
})

// router.get('/login',
//     (req, res) => {
//         userService.login(req, res)
//     }
// )

router.get('/findAll',
    (req, res) => {
        parcelService.findAll(req, res)
    }
)

router.get('/findSent',
    (req, res) => {
        parcelService.findSent(req, res)
    }
)

router.get('/findReceived',
    (req, res) => {
        parcelService.findReceived(req, res)
    }
)


module.exports = router