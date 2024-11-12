const {io} = require('socket.io-client')
const socket = io('http://localhost:3000')
socket.connect()

setInterval(() => {
    socket.emit('consumeTopic', 'anadi', (err, message) => {
        if (err) {
            console.error(err)
        } else {
            console.log('topic1',message)
        }
    })
}, 5000);

setInterval(() => {
    socket.emit('consumeTopic', 'sharma', (err, message) => {
        if (err) {
            console.error(err)
        } else {
            console.log('topic2',message)
        }
    })
}, 5000);

