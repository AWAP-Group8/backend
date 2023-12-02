const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const expressjwt = require('express-jwt')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
const secret = 'pkt-management'
const noNeedTokenList = [
  '/user/login',
  { url: '/user/register', methods: ['POST'] },
  '/driver/login',
  { url: '/driver/register', methods: ['POST'] },
  /^\/locker\//
]
app.use(expressjwt({
    credentialsRequired: true,
    secret,
    algorithms: ['HS256'],
    getToken(req) {
        if (req.headers.token) {
            return req.headers.token
        }
        return null
    }
}).unless({
    path: noNeedTokenList
}))
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.send({
            code: 401,
            message: '未授权的访问'
        })
    } else {
        console.log(err)
    }
})
const database = require('./modules/database')
database.init()
const user = require('./routers/user')
app.use('/user', user)
const parcel = require('./routers/parcel')
app.use('/parcel', parcel)
const locker = require('./routers/locker')
app.use('/locker', locker)
const driver = require('./routers/driver')
app.use('/driver', driver)
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})