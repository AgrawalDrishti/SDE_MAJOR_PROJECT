require('dotenv').config()

const express = require("express")
const app = express()
app.use(express.json())

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
const TopicBrokerMap = {}

app.get("/",
    (req,res) => res.send({message:`Zookeeper running at ${ZOOKEEPER_PORT}`})
)

app.get("/getMapping",
    (req,res) => res.send({mapping:TopicBrokerMap})
)

app.post("/addEntry", (req,res) => {
    const topic = req.body.topic;
    const broker = req.body.broker;
    TopicBrokerMap[topic] = broker;
    return res.send({message:"Entry added"});
})

app.listen(ZOOKEEPER_PORT, () => {
    console.log(`Zookeeper running at ${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}`);
})
