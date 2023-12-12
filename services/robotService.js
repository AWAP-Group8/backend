const robotService = {}
const { asyncQuery } = require('../modules/database')
const axios = require('axios')
const config = require('./config')


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

robotService.createParcel = async (req, res) => {
    async function createParcel() {
        try {
            // generate two random letters
            const generateRandomLetters = () => {
                const alphabet = ['A', 'B', 'C', 'D', 'E'];
                const randomLetters = [];
                for (let i = 0; i < 2; i++) {
                    const randomIndex = Math.floor(Math.random() * alphabet.length);
                    randomLetters.push(alphabet[randomIndex]);
                }
                return randomLetters; // Return the generated random letters
            }

            const [pickupLocker, senderLocker] = generateRandomLetters(); // Destructure the array

            const generateRandomNumber = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            const response = await axios.get(`${config.backendUrl}/getAllUsers`);
            const userData = response.data.users;
            const sender = userData[generateRandomNumber(0, userData.length - 1)];
            let receiver;
            do {
                receiver = userData[generateRandomNumber(0, userData.length - 1)];
            } while (receiver.email === sender.email);
            
            const response1 = await axios.get(`${config.backendUrl}/findEmptyCabinet?locker=${pickupLocker}`);
            const sC = response1.data.data.list;
            //push sender cabinet into array
            const sCabinet = sC.map(item => item.value);
            const senderCabinet = sCabinet[generateRandomNumber(0, sCabinet.length - 1)];
            const response2 = await axios.get(`${config.backendUrl}/findEmptyCabinet?locker=${senderLocker}`);
            const rC = response2.data.data.list;
            //push receiver cabinet into array
            const rCabinet = rC.map(item => item.value);
            const receiverCabinet = rCabinet[generateRandomNumber(0, rCabinet.length - 1)];

            const requestBody = {
                sender_name: sender.username,
                sender_email: sender.email,
                pickup_locker: pickupLocker,
                pickup_cabinet: receiverCabinet,
                receiver_name: receiver.username,
                receiver_email: receiver.email,
                length: generateRandomNumber(10, 50),
                width: generateRandomNumber(10, 50),
                height: generateRandomNumber(10, 50),
                mass: generateRandomNumber(10, 50),
                sender_locker: senderLocker,
                sender_cabinet: senderCabinet,
            };
            console.log(requestBody);
            const response3 = await axios.post(`${config.backendUrl}/addTestParcel`, requestBody);
            const parcel = response3.data.msg;
            res.send(parcel);
        } catch (e) {
            console.log(e);
            res.status(500).send('Internal Server Error');
        }
    }

    createParcel();
};
module.exports = robotService