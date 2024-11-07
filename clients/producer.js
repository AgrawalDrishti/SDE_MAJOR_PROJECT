const { io } = require('socket.io-client')

const socket = io('http://localhost:3000')
socket.connect()

socket.emit('addTopic', 'topic1')
socket.emit('addTopic', 'topic2')

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic1', randomMessage, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(res);
        }
    });
}, 5000);

setInterval(() => {
    const randomMessage = getRandomString(10);
    socket.emit('publish', 'topic2', randomMessage, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log(res);
        }
    });
}, 3000);
