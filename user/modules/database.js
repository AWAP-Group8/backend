const mysql = require("mysql")
const fs = require("fs")
const connection = mysql.createConnection({
    host: 'gogoship-database.mysql.database.azure.com',
    port: '3306',
    user: 'gogoshiproot',
    password: 'AWAP-Group8',
    database: 'gogoship',
    ssl: {
        ca: fs.readFileSync(__dirname + '/DigiCertGlobalRootCA.crt.pem')
    }
});
function init() {

    global.connection = connection
    connection.connect({}, (err) => {
        if (err !== null)
            console.log(err, 'err')
    })
}

module.exports.init = init
module.exports.getConnection = function () {
    return connection
}