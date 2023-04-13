const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const conncetion = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await conncetion.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      conncetion.close();
    }, 1000);
  },
};

module.exports = ProducerService;
