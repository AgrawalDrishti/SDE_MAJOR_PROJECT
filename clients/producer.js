const { io } = require('socket.io-client')

const socket = io('http://localhost:3000')
socket.connect()

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

socket.emit('addTopic', 'topic1', (err, res) => logger(err, res))
socket.emit('addTopic', 'topic2', (err, res) => logger(err, res))


setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic1', randomMessage, (err, res) => logger(err,res));
}, 5000);

setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic2', randomMessage, (err, res) => logger(err,res));
}, 3000);
