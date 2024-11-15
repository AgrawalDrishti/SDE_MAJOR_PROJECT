const broker_router = require('express').Router();
const broker_controller = require('../controllers/broker_controller');

broker_router.get("/all" , broker_controller.get_all);
broker_router.post("/add" , broker_controller.add_broker);
broker_router.post("/ping" , broker_controller.ping_broker);

module.exports = broker_router;