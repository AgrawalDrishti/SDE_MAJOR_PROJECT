require('dotenv').config()
const { io } = require('socket.io-client')
const axios = require('axios')
const readline = require('readline')

const ZOOKEEPER_PORT = process.env.ZOOKEEPER_PORT || 8000;
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
const ZOOKEEPER_HOST = process.env.ZOOKEEPER_HOST || 'http://localhost';
var topics = [];
var mapping = {};

function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function logger(err, res){
    if (err){
        console.error(err)
    }
    else {
        console.log(res)
    }
}

function startPublishing(topic){
    const socket = io(mapping[topic]);
    socket.connect();

    setInterval(() => {
        socket.emit('publish',topic,topic+"-"+getRandomString(2), (err, res) => logger(err,res));
    }, 2000);

    socket.on('disconnect', async () => {
        console.log('Lost connection to broker');
        try {
            const res = await axios.post(`${ZOOKEEPER_HOST}:${ZOOKEEPER_PORT}/broker/ping`, {topic: topic});
            mapping[topic] = res.data.broker_url;
            startPublishing(topic);
        } catch (err) {
            console.error(err);
            console.log("Unable to find leader broker!");
        }
    });
}


rl.question("Enter the number of topics you want this producer to publish to:",num_topics => {
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

    topics.forEach((topic) => {
        startPublishing(topic,mapping[topic]);
    })
})