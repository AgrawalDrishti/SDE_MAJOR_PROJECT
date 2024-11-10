require('dotenv').config()

const express = require("express")
const app = express()
app.use(express.json())

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
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
    console.log(`Zookeeper running at http://localhost:${ZOOKEEPER_PORT}`);
})
