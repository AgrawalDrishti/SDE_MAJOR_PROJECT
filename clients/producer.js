const { io } = require('socket.io-client')
const axios = require('axios')

const socket = io('http://localhost:3000')
socket.connect()

const rl = readline.createInterface({input: process.stdin,output: process.stdout});
// TO DO: Implement the remaining producer logic

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function logger(err, res){
    if (err){
        console.error(err)
    }
    else {
        console.log(res)
    }
}


setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic1', randomMessage, (err, res) => logger(err,res));
}, 5000);

setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic2', randomMessage, (err, res) => logger(err,res));
}, 3000);
