// config/kafka.js

require('dotenv').config();

module.exports = {
  clientId: process.env.KAFKA_CLIENT_ID || 'contract-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'contract-group',
  contractCreateRequestTopic: process.env.KAFKA_CONTRACT_CREATE_TOPIC || 'contract.create-request',
};
