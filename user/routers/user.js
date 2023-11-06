const express = require("express")
const router = express.Router()
const userService = require('../services/userService')

router.post('/register',
    (req, res) => {
        userService.register(req, res)
    },
)

router.get('/login',
    (req, res) => {
        userService.login(req, res)
    }
)


module.exports = router