require('dotenv').config()
const axios = require('axios')
const express = require("express")
const { Mutex } = require('async-mutex')

const app = express()
app.use(express.json())

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';

const TopicBrokerMap = {};
const mutex = new Mutex();
var broker_i = 0;
var brokers = [];

app.get("/",
    (req,res) => res.send({message:`Zookeeper running at ${ZOOKEEPER_PORT}`})
)

app.get("/getMapping",
    (req,res) => res.send({mapping:TopicBrokerMap})
)

app.post("/addEntry", async (req,res) => {
    const topic = req.body.topic;
    const release = await mutex.acquire();

    console.log(`Adding topic ${topic} to broker at ${brokers[broker_i]}`);
    
    axios.post(`${brokers[broker_i]}/addTopic`, {
        topic: topic
    }).then((result) => {
        if (result.data.message == "Topic added") {
            TopicBrokerMap[topic] = brokers[broker_i]; 
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

app.post("/addBroker", async (req,res) => {
    try {
        const broker_url = req.data.broker_url;
        brokers.push(broker_url);
        return res.status(200).send({message:"Successfully registered the broker at Zookeeper!"});
    } catch (err) {
        return res.status(400).send({message:"Error registering broker "+err});
    }
})

app.listen(ZOOKEEPER_PORT, () => {
    console.log(`Zookeeper running at ${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}`);
})
