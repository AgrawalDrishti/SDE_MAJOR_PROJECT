const axios = require('axios');

const add_topic_to_broker = async (req,res) => {
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
}

const remove_topic_from_broker = (req,res) => {
    try {
        if (TopicLeaderBrokerMap[req.body.topic]) {
            delete TopicLeaderBrokerMap[req.body.topic];
            console.log("Removing topic:",req.body.topic);
            res.status(200).send({message:"Successfully removed the topic!"})
        } else {
            res.status(404).send({Error:"Topic not found!"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({Error:"Error removing the topic"+err});
    }
}

module.exports = { add_topic_to_broker , remove_topic_from_broker }