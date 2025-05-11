const { Kafka } = require('kafkajs');
const config = require('../config');
const ContractService = require('../services/ContractService');

const kafka = new Kafka({
  clientId: 'contract-service',
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.kafka.consumerGroupId });

const startConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: config.kafka.contractCreateRequestTopic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const eventData = JSON.parse(message.value.toString());
          console.log("Received message", {topic, partition, eventData})
          // Extract data from the event and create a contract
          const { order_id, final_amount, contract_details, contract_date, contract_status } = eventData;

          await ContractService.createContractFromEvent({
            order_id,
            final_amount,
            contract_details,
            contract_date,
            contract_status
          });

          console.log('Contract created from Kafka event');
        } catch (error) {
          console.error('Error processing Kafka message:', error);
          // Implement dead letter queue or retry mechanism if needed
        }
      },
    });

    console.log('Kafka consumer started');
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
  }
};

module.exports = { startConsumer };