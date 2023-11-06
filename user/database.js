const mysql = require("mysql")
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Kajaanintie32',
    database: 'pkt-consumer'
});
function init() {
    
    global.connection = connection
    connection.connect({}, (err) => {
        if (err !== null)
            console.log(err, 'err')
    })
}

module.exports.init = init
module.exports.getConnection = function() {
    return connection
}