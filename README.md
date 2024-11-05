# Basic Implementation of **Apache Kafka**

Apache Kafka is a distributed streaming platform used for building real-time data pipelines and streaming applications. It is designed to handle high throughput and low latency, making it ideal for processing large streams of data in real-time.

This project aims at implementing a basic model of Kafka

## Key Features

- **Scalability**: Kafka can scale horizontally by adding more brokers to the cluster.
- **Fault Tolerance**: Data is replicated across multiple brokers to ensure reliability.
- **High Throughput**: Capable of handling thousands of messages per second.
- **Durability**: Messages are persisted on disk, ensuring they are not lost.

## Components

- **Producer**: Sends messages to Kafka topics
- **Consumer**: Reads messages from Kafka topics
- **Broker**: Manages the storage and retrieval of messages
- **Topic**: A category or feed name to which messages are published

## How It Works

1. **Producers** send messages to a **Kafka topic**
2. **Brokers** store the messages and ensure they are replicated for fault tolerance
3. **Consumers** subscribe to topics and process the messages in real-time
