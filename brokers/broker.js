const express = require("express")
const app = express()

const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const port = 3000
const messages = {}
const topics = []

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})

io.on("connection", (socket) => {
    console.log(`A client connected ${socket.id}`)

    socket.on("disconnect", () => {
        console.log(`A client disconnected ${socket.id}`)
    })

    socket.on("addTopic", (topic) => {
        topics.push(topic)
        messages[topic] = []
        console.log(`Added topic ${topic}`)
    })

    socket.on("publish", (topic, message,callback) => {
        messages[topic].push(message)
        console.log(`Published message to ${topic}`)
        callback("Message published")
    })

    socket.on("consumeTopic", (topic, callback) => {
        if (topics.includes(topic) && messages[topic].length > 0) {
            callback(null, messages[topic].shift())
        } else {
            callback("No messages")
        }
    })
})