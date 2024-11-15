const axios = require('axios');

const get_all = (req,res) => res.status(200).send({brokers:brokers})

const add_broker = async (req,res) => {
    try {
        const broker_url = req.body.broker_url;
        console.log("Adding a broker:", broker_url);
        brokers.push(broker_url);
        return res.status(200).send({message:"Successfully registered the broker at Zookeeper!"});
    } catch (err) {
        return res.status(400).send({message:"Error registering broker "+err});
    }
}

const ping_broker = async (req,res) => {
    try {
        const res_from_broker = await axios.get(TopicLeaderBrokerMap[req.body.topic]);
        if (res_from_broker.status === 200) {
            console.log("Broker is alive!");
            return res.status(200).send({message:"Broker is alive!"});
        } else {
            console.log("Broker is busy!");
            return res.status(200).send({message:"Please wait for some time, broker is busy!"});
        }
    } catch (error) {
        console.log(`Broker ${TopicLeaderBrokerMap[req.body.broker_url]} is not responding!`);
        console.log("Initiating leader selection");

        const new_leader_broker_url = TopicFollowerBrokersMap[req.body.topic].shift();
        TopicLeaderBrokerMap[req.body.topic] = new_leader_broker_url;

        brokers = brokers.filter(broker => broker !== req.body.broker_url);

        axios.post(`${new_leader_broker_url}/setFollowers`, {topic: req.body.topic, followers: TopicFollowerBrokersMap[req.body.topic]});
        return res.status(200).send({
            message:"Broker is not responding, elected new Leader!",
            broker_url: new_leader_broker_url
        });
    }
}

module.exports = { get_all , add_broker , ping_broker }