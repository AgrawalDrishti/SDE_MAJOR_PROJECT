require('dotenv').config()
const {io} = require('socket.io-client')
const axios = require('axios')
const readline = require('readline')
const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
var topics = [];
var mapping = {};
var consumedLength = {};

function logger(err, res){
    if (err){
        console.error(err)
    }
    else {
        console.log(res)
    }
}

async function startConsuming(topic){
    const socket = io(mapping[topic]);
    socket.connect();
    if (!consumedLength[topic]) {
        consumedLength[topic] = 0;
    }
    setInterval( async () => {
        socket.emit('consumeTopic', [topic, consumedLength[topic]], (err, res) => {
            if (err){
                console.error(err);
            } else {
                try {
                    const result = res;
                    console.log(result);
                    if (Array.isArray(result) || typeof result === 'string') {
                        consumedLength[topic] += result.length + 1;
                    } else {
                        console.error('Unexpected response format:', result);
                    }
                } catch (error) {
                    console.error('Error processing response:', error);
                }
            }
        });
    }, 5000);

    socket.on('disconnect', async () => {
        console.log('Lost connection to broker');
        const res = await axios.get(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/getBroker`);
        mapping[topic] = res.data.broker;
        startConsuming(topic);
    });
}

rl.question("Enter the number of topics you want to consume :",num_topics => {
    let topic_i = 0;
    const getTopic = () => {
        if (topic_i < num_topics) {
            rl.question(`Enter the name of topic ${topic_i}: `, topic => {
                topics.push(topic);
                topic_i++;
                getTopic();
            })
        } else {
            rl.close();
        }
    }

    getTopic();
})

rl.on('close', async () => {
    console.log("Topics:",topics);
    await axios.get(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/getMapping`)
    .then((result) => {
        const full_mapping = result.data.mapping;
        Object.keys(full_mapping).forEach((topic) => {
            if (topics.includes(topic)){
                mapping[topic] = full_mapping[topic];
            }
        })
    }).catch((err) => {
        console.error(err);
    });
    console.log("Mapping:",mapping);
    topics.forEach((topic) => {
        startConsuming(topic);
    })
})
