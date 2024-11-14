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
const REPLICA_FACTOR = process.env.REPLICA_FACTOR || 2;

const TopicLeaderBrokerMap = {};
const TopicFollowerBrokersMap = {};
const mutex = new Mutex();
var broker_i = 0;
var brokers = [];

app.get("/",
    (req,res) => res.status(200).send({message:`Zookeeper running at ${ZOOKEEPER_PORT}`})
)

app.get("/getMapping",
    (req,res) => res.status(200).send({mapping:TopicLeaderBrokerMap})
)

app.get("/getBrokers", 
    (req,res) => res.status(200).send({brokers:brokers})
)

app.post("/addTopic", async (req,res) => {
    const topic = req.body.topic;
    const release = await mutex.acquire();

    console.log(`Adding topic ${topic} to broker at ${brokers[broker_i]}`);
    
    axios.post(`${brokers[broker_i]}/addTopic`, {
        topic: topic
    }).then((result) => {
        if (result.data.message == "Topic added") {
            TopicLeaderBrokerMap[topic] = brokers[broker_i];

            broker_i = (broker_i+1) % brokers.length;

            return res.send({message:"Entry added"});
        } else {
            console.log("Error adding topic to broker");
            return res.send({message:"Error adding topic to broker"});
        }
    }).catch((err) => {
        console.log("Error "+err);
        return res.send({message:"Error "+err});
    }).finally(() => {
        release();
    })
})

app.delete("/removeTopic", (req,res) => {
    try {
        console.log("Removing topic:",req.body.topic);
        if (TopicLeaderBrokerMap[req.body.topic]) {
            delete TopicLeaderBrokerMap[req.body.topic];
            res.status(200).send({message:"Successfully removed the topic!"})
        } else {
            res.status(404).send({Error:"Topic not found!"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({Error:"Error removing the topic"+err});
    }
})

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
    console.log(`Zookeeper running at ${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}`);
})
