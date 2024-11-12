require('dotenv').config()
const { exec } = require('child_process');


const script_path = './brokers/broker.js';
const num_brokers = process.env.NUM_BROKERS || 2;
const broker_port_start = process.env.BROKER_PORT_START || 3000;

for(let i=0; i<num_brokers; i++){

    const port = parseInt(broker_port_start) + i;

    exec(`node ${script_path} ${port}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
    
    console.log("broker at port",port,"initiated");
}