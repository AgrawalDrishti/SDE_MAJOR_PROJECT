require('dotenv').config()

const axios = require('axios')
const readline = require('readline');

const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;

const rl = readline.createInterface({input: process.stdin,output: process.stdout});

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
    topics.forEach((topic) => {
        axios.post(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/topic/add`, {
            topic: topic,
        }).then((result) => {
            console.log(topic, result.data);
        }).catch((err) => {
            console.log(topic, err);
        });
    });
});
