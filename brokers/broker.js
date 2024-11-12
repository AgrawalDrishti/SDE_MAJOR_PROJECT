require('dotenv').config()
const express = require("express")
const app = express()
const axios = require('axios')
const fh = require('../utils/file-handler');

app.use(express.json())

const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const port = process.argv[2];
const MESSAGE_DIRECTORY = process.env.MESSAGE_DIRECTORY || "./brokers/messages";
const messages = {}
const topics = []

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    fh.create_message_directory(`${MESSAGE_DIRECTORY}/BROKER${port}`);
})

io.on("connection", (socket) => {
    console.log(`A client connected ${socket.id}`)

    socket.on("disconnect", () => {
        console.log(`A client disconnected ${socket.id}`)
    })
    
    socket.on("publish", (topic, message, callback) => {
        messages[topic].push(message);
        fh.add_message_to_file(`${MESSAGE_DIRECTORY}/BROKER${port}`, `${topic}.txt`, message);
        callback("Message published");
    })

    socket.on("consumeTopic", (topic, callback) => {
        if (topics.includes(topic) && messages[topic].length > 0) {
            callback(null, messages[topic].shift());
        } else {
            callback("No messages");
        }
    })
})

app.get("/", 
    (req,res) => res.send({message:`Broker running at ${port}`})
)

app.get("/topics", 
    (req,res) => res.send({topics:topics})
)

app.post("/addTopic", (req,res) => {
    const reqTopic = req.body.topic;
    messages[reqTopic] = [];
    topics.push(reqTopic);
    try {
        fh.create_message_file(`${MESSAGE_DIRECTORY}/BROKER${port}`, `${reqTopic}.txt`);
        return res.status(200).send({message:"Topic added"});
    } catch (err) {
        console.error(err);
        return res.status(500).send({error:"Topic could not be added"});
    }
})