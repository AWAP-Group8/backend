const express = require("express")
const cors = require('cors');
const app = express();
const port = 3000
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
const database = require('./modules/database')
database.init()
const user = require('./routers/user')
app.use('/user', user)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})