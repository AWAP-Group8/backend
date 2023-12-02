const { asyncQuery } = require('../modules/database')
async function generateCode(pickup_locker) {
  let randomCode
  let res
  do {
      randomCode = Math.floor(Math.random() * 9000) + 1000
      const findSql = `select code from locker_management where locker = '${pickup_locker}' and code = '${randomCode}'`
      res = await asyncQuery(findSql)
  } while (res.length > 0)
  return randomCode
}

module.exports = {
  generateCode,
}