const axios = require('axios');

// helper functions ---------------------------------------------------
const get_random_sample = (arr , exclude_arr, sample_size) => {
    let sample = [];
    let temp_exclude_arr = []; for(let i=0;i<exclude_arr.length;i++) temp_exclude_arr.push(exclude_arr[i]);

    let i = 0;
    while (i < sample_size){
        let rand_indx = Math.floor(Math.random() * arr.length);
        if (!temp_exclude_arr.includes(arr[rand_indx])){
            sample.push(arr[rand_indx]); 
            temp_exclude_arr.push(arr[rand_indx]);
            i++;
        }
    }

    return sample;
}


// functions for controller --------------------------------------------
const add_topic_to_broker = async (req,res) => {
    const topic = req.body.topic;
    const release = await mutex.acquire();

    console.log(`Adding topic ${topic} to broker at ${brokers[broker_i]}`);
    axios.post(`${brokers[broker_i]}/addTopic`, {
        topic: topic
    }).then( async (result_for_topic) => {
        if (result_for_topic.data.message == "Topic added") {

            TopicLeaderBrokerMap[topic] = brokers[broker_i];

            const follower_brokers = get_random_sample(brokers, [brokers[broker_i]], REPLICATION_FACTOR-1);
            axios.post(`${brokers[broker_i]}/setFollowers`, {
                topic: topic,
                followers: follower_brokers
            })
            .then((result_for_followers) => {
                if (result_for_followers.status === 200){
                    TopicFollowerBrokersMap[topic] = follower_brokers;

                    for(let follower_i = 0 ; follower_i < follower_brokers.length ; follower_i++){
                        axios.post(follower_brokers[follower_i]+'/addTopic', {
                            topic: topic,
                        }).then((res) => {
                            console.log(res.data.message," to the follower");
                        }).catch((err) =>{
                            console.error(err);
                        })
                    }

                    console.log("Topic and followers added to broker");
                } else {
                    console.log("Error adding followers to broker");
                }
            }).catch((err) => {
                console.log("Error adding followers to broker "+err);
            });
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