const { io } = require('socket.io-client')

const socket = io('http://localhost:3000')
socket.connect()

socket.emit('addTopic', 'topic1')

socket.emit('publish' ,'topic1', 'Hello, world!',(err, res)=>{
    if(err){
        console.error(err)
    }else{
        console.log(res)
    }
})
