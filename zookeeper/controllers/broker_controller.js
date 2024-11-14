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
        const res_from_broker = await axios.get(req.body.broker_url);
        if (res_from_broker.status === 200) {
            return res.status(200).send({message:"Broker is alive!"});
        } else {
            return res.status(200).send({message:"Please wait for some time, broker is busy!"});
        }
    } catch (error) {
        return res.status(500).send({message:"Broker is not responding, initiaiting leader election!"});
    }
}

module.exports = { get_all , add_broker , ping_broker }