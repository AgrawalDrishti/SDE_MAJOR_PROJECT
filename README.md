# Implementation of **Kafka**

Kafka is a distributed streaming platform used for building real-time data pipelines. It is designed to handle high throughput and low latency, making it ideal for processing large streams of data in real-time.

This project aims at implementing a model of Kafka with Added Fault Tolerance which was not originally proposed by LinkedIn

## Getting Started

### Prerequisites
- Ensure you have Node.js and npm installed on your machine.
    ```bash
   node --version >= v18.13.0
   ```
- Make sure you've set the environment vairables by creating a `.env` file for each of these folders: 

    1. Zookeeper
    2. Brokers
    3. Config
    4. Clients

- Trial values for `.env` (can use this for all the above folders)
    ```py
    NUM_BROKERS=5
    REPLICATION_FACTOR=3
    ZOOKEEPER_PORT=8000
    ZOOKEEPER_HOST="http://localhost"
    BROKER_HOST="http://localhost"
    ```

## Zookeeper
Open the `zookeeper` folder in the root directory, then:

1. **Install Dependencies:**

   ```bash
   npm i
   ```

2. **Start Zookeeper**

    ```bash
    node zookeeper.js
    ```

If no port is specified in `.env` it will run on PORT **8000** by default

## Brokers
Open the `brokers` folder in the root directory, then:

1. **Install Dependencies:**

   ```bash
   npm i
   ```

2. **Start the Broker**

    ```bash
    node broker.js <PORT>
    ```
    Example:
    ```bash
    node broker.js 3000
    ```

## Topics
Open the `config` folder in the root directory, then:

1. **Install Dependencies:**

   ```bash
   npm i
   ```

2. **To Add Topics**

    ```bash
    node  topics\add-topics.js
    ```

2. **To Remove Topics**

    ```bash
    node topics\remove-topics.js
    ```

## Clients
Open the `clients` folder in the root directory, then:

1. **Install Dependencies:**

   ```bash
   npm i
   ```

2. **To start the Producer**

    ```bash
    node producer.js 
    ```

2. **To start the Consumer**

    ```bash
    node consumer.js
    ```