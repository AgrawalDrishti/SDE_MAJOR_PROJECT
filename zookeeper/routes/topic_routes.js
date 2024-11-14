const topic_router = require('express').Router();
const topic_controller = require('../controllers/topic_controller');

topic_router.post("/add", topic_controller.add_topic_to_broker);
topic_router.delete("/remove", topic_controller.remove_topic_from_broker);

module.exports = topic_router;