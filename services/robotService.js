const robotService = {}
const { asyncQuery } = require('../modules/database')

robotService.getAllUsers = async (req, res) => {
    const selectAllSql = 'SELECT * FROM gogoship.users_management';
    const data = {};

    try {
        const users = await asyncQuery(selectAllSql);
        data.success = true;
        data.code = 'FETCH SUCCESSFUL';
        data.msg = 'Data fetched successfully';
        data.users = users;
    } catch (e) {
        data.success = false;
        data.code = 'FETCH FAILED';
        data.msg = 'Failed to fetch data';
        console.log(e);
    } finally {
        res.send(data);
    }
};

robotService.findAllParcels = async (req, res) => {
    const selectAllSql = 'SELECT * FROM gogoship.parcels_management';
    const data = {};

    try {
        const users = await asyncQuery(selectAllSql);
        data.success = true;
        data.code = 'FETCH SUCCESSFUL';
        data.msg = 'Data fetched successfully';
        data.users = users;
    } catch (e) {
        data.success = false;
        data.code = 'FETCH FAILED';
        data.msg = 'Failed to fetch data';
        console.log(e);
    } finally {
        res.send(data);
    }
};

module.exports = robotService