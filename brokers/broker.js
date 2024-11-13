require('dotenv').config()
const express = require("express")
const axios = require('axios')
const fh = require('./file-functions/file-handler');
const cors = require('cors');
const http = require("http")
const { Server } = require("socket.io")

const app = express()
app.use(express.json())
app.use(cors());

const server = http.createServer(app)
const io = new Server(server)

const MESSAGE_DIRECTORY = process.env.MESSAGE_DIRECTORY || "./brokers/messages";
const BROKER_HOST = process.env.BROKER_HOST || 'http://localhost';
const PORT = process.argv[2];
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;

const messages = {}
const topics = []

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    fh.create_message_directory(`${MESSAGE_DIRECTORY}/BROKER${PORT}`);
    axios.post(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/addBroker`, {
        broker_url:`${BROKER_HOST}:${PORT}`
    }).then((result) => {
        console.log(result.data);
    }).catch((err) => {
        console.error(err);
    });;
})

io.on("connection", (socket) => {
    console.log(`A client connected ${socket.id}`)

    socket.on("disconnect", () => {
        console.log(`A client disconnected ${socket.id}`)
    })
    
    socket.on("publish", (topic, message, callback) => {
        messages[topic].push(message);
        fh.add_message_to_file(`${MESSAGE_DIRECTORY}/BROKER${PORT}`, `${topic}.txt`, message);
        callback("Message published");
    })

    socket.on("consumeTopic", async (topic, callback) => {
        if (topics.includes(topic[0])) {
            try {
                const res = await fh.read_message_file(`${MESSAGE_DIRECTORY}/BROKER${PORT}`, `${topic[0]}.txt`, topic[1]);
                callback(null, String(res));
            } catch (err) {
                callback("Error reading message file");
            }
        } else {
            callback("No messages");
        }
    })
})

app.get("/", 
    (req,res) => res.send({message:`Broker running at ${PORT}`})
)

app.get("/topics", 
    (req,res) => res.send({topics:topics})
)

app.post("/addTopic", (req,res) => {
    const reqTopic = req.body.topic;
    messages[reqTopic] = [];
    topics.push(reqTopic);
    try {
        fh.create_message_file(`${MESSAGE_DIRECTORY}/BROKER${PORT}`, `${reqTopic}.txt`);
        return res.status(200).send({message:"Topic added"});
    } catch (err) {
        console.error(err);
        return res.status(500).send({error:"Topic could not be added"});
    }
})