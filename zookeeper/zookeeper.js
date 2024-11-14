require('dotenv').config()
const express = require("express")
const { Mutex } = require('async-mutex')
const cors = require('cors');
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors());

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';

app.get("/",
    (req,res) => res.status(200).send({message:`Zookeeper running at ${ZOOKEEPER_PORT}`})
)

app.get("/getMapping",
    (req,res) => res.status(200).send({mapping:TopicLeaderBrokerMap})
)

app.get("/getBrokers", 
    (req,res) => res.status(200).send({brokers:brokers})
)

app.post("/addBroker", async (req,res) => {
    try {
        const broker_url = req.body.broker_url;
        console.log("Adding a broker:", broker_url);
        brokers.push(broker_url);
        return res.status(200).send({message:"Successfully registered the broker at Zookeeper!"});
    } catch (err) {
        return res.status(400).send({message:"Error registering broker "+err});
    }
})

app.listen(ZOOKEEPER_PORT, () => {
    global.REPLICA_FACTOR = process.env.REPLICA_FACTOR || 2;

    global.TopicLeaderBrokerMap = {};
    global.TopicFollowerBrokersMap = {};
    global.mutex = new Mutex();
    global.broker_i = 0;
    global.brokers = [];

    console.log(`Zookeeper running at ${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}`);
})

app.use("/topic", require("./routes/topic_routes"))