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

app.get("/getFollowers",
    (req,res) => res.status(200).send({mapping:TopicFollowerBrokersMap})
)

app.listen(ZOOKEEPER_PORT, () => {
    global.REPLICA_FACTOR = process.env.REPLICA_FACTOR || 2;

    global.TopicLeaderBrokerMap = {};
    global.TopicFollowerBrokersMap = {};
    global.mutex = new Mutex();
    global.broker_i = 0;
    global.brokers = [];

    console.log(`Zookeeper running at ${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}`);
})

app.use("/topic", require("./routes/topic_routes"));
app.use("/broker", require("./routes/broker_routes"));