const amqplib = require('amqplib');

const { createLambda } = require('./lambdaClients/lambdaClientFactory');

//Test

(async () => {
  let connection;

  // const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5672"
  //const amqpUrl = process.env.AMQP_URL || "amqps://notification:notification@b-e8483c76-d95a-4135-9415-577312b22af8.mq.ap-southeast-1.amazonaws.com:5671" //current queue endpoint configured
  const amqpUrl = process.env.AMQP_URL || '';

  connection = await amqplib.connect(amqpUrl, 'heartbeat=60');

  const channel = await connection.createChannel();

  const exchangeName = 'my_topic_exchange';
  const queueNames = [
    'Workshop_Registration_Notification',
    'Foodrescue_Notification',
    'Workshop_Withdrawal_Notification',
  ];

  // Declare the topic exchange and queues (no need to bind queues here)
  await channel.assertExchange(exchangeName, 'topic', { durable: true });

  for (const queueName of queueNames) {
    await channel.assertQueue(queueName, { durable: true });
  }

  // Consume messages from the queues
  const consumeQueue = async (queueName) => {
    await channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        console.log(`Consumed message content is [${msg.content.toString()}]`);

        if (
          queueName === 'Workshop_Withdrawal_Notification' ||
          queueName === 'Foodrescue_Notification' ||
          queueName === 'Workshop_Registration_Notification'
        ) {
          const createdLambda = await createLambda(queueName);
          createdLambda.invoke(msg.content);

          console.log(`Consume message from [${queueName}]`);
        } else {
          console.log(`Message dropped from [${queueName}]`);
        }

        // Acknowledge the message when processing is complete
        channel.ack(msg);
      }
    });
  };

  for (const queueName of queueNames) {
    await consumeQueue(queueName);
  }

  console.log(' [*] Waiting for messages. To exit press CTRL+C');
})();
