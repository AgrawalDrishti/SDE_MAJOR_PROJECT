require('dotenv').config()

const axios = require('axios')
const readline = require('readline');

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;

const rl = readline.createInterface({input: process.stdin,output: process.stdout});

const num_brokers = process.env.NUM_BROKERS || 1;
const broker_port_start = parseInt(process.env.BROKER_PORT_START) || 3000;

let topics = [];

rl.question('How many topics do you want to make? ', (numTopics) => {
    let count = 0;

    const getTopic = () => {
        if (count < numTopics) {
            rl.question(`Enter name for topic ${count + 1}: `, (topic) => {
                topics.push(topic);
                count++;
                getTopic();
            });
        } else {
            console.log('Topics:', topics);
            rl.close();
        }
    };
    getTopic();
});

rl.on('close', () => {
    let broker_i = 0;
    topics.forEach((topic) => {
        const broker_port = broker_port_start + broker_i;
        console.log(`Adding topic ${topic} to broker at port ${broker_port}`);
        axios.post(`http://localhost:${broker_port}/addTopic`, {
            topic: topic
        })
        .then((res) => {
            console.log(res.data.message);
            axios.post(`http://localhost:${ZOOKEEPER_PORT}/addEntry`, {
                topic: topic,
                broker: `http://localhost:${broker_port}`
            })
        })
        .catch((err) => {
            console.error(err);
        });
        broker_i = (broker_i+1) % num_brokers;
    });
});
