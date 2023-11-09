const express = require("express")
const cors = require('cors');
const app = express();
const port = 3000
const expressjwt = require('express-jwt')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
const secret = 'pkt-management'
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
    path: ['/user/login', { url: '/user/register', methods: ['POST'] }]
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
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})