require('dotenv').config()

const axios = require('axios')
const readline = require('readline');

const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;

const rl = readline.createInterface({input: process.stdin,output: process.stdout});

const num_brokers = process.env.NUM_BROKERS || 1;
const broker_port_start = parseInt(process.env.BROKER_PORT_START) || 3000;
const BROKER_HOST = process.env.BROKER_HOST || 'http://localhost';

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
        axios.post(`${BROKER_HOST}:${broker_port}/addTopic`, {
            topic: topic
        })
        .then((res) => {
            console.log(res.data.message);
            axios.post(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/addEntry`, {
                topic: topic,
                broker: `${BROKER_HOST}:${broker_port}`
            })
        })
        .catch((err) => {
            console.error(err);
        });
        broker_i = (broker_i+1) % num_brokers;
    });
});
