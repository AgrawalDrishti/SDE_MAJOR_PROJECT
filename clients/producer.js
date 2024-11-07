const { io } = require('socket.io-client')

const socket = io('http://localhost:3000')
socket.connect()

function logger(err, res){
    if (err){
        console.error(err)
    }
    else {
        console.log(res)
    }
}

socket.emit('addTopic', 'topic1', (err, res) => logger(err, res))
socket.emit('publish' ,'topic1', 'Hello, world!',(err, res)=> logger(err, res))
