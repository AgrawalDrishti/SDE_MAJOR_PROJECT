const {io} = require('socket.io-client')
const socket = io('http://localhost:3000')
socket.connect()

setInterval(() => {
    socket.emit('consumeTopic', 'topic1', (err, message) => {
        if (err) {
            console.error(err)
        } else {
            console.log(message)
        }
    })
}, 6000);

setInterval(() => {
    socket.emit('consumeTopic', 'topic2', (err, message) => {
        if (err) {
            console.error(err)
        } else {
            console.log(message)
        }
    })
}, 6000);

