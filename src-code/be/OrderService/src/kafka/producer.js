const { Kafka } = require('kafkajs');
const config = require('../config/config');

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const producer = kafka.producer();

const sendCreateContractEvent = async (data) => {
  await producer.connect();
  await producer.send({
    topic: config.kafka.contractCreateRequestTopic,
    messages: [
      { value: JSON.stringify(data) },
    ],
  });
  await producer.disconnect();
};

module.exports = { sendCreateContractEvent };
