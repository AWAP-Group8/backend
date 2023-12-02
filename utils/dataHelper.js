function setInternalError(data) {
    data.success = false
    data.code = 'INTERNAL_ERR'
    data.msg = 'internal error'
}

function setData(data, success, code, msg) {
    data.success = success
    data.code = code
    data.msg = msg
}

function insertIntoHelper(object) {
  let nameArr = []
  let valueArr = []
  Object.keys(object).forEach(key => {
      nameArr.push(key)
      valueArr.push(`'${object[key]}'` ?? null)
  })
  return [nameArr.join(','), valueArr.join(',')]
}
module.exports = { setInternalError, setData, insertIntoHelper };