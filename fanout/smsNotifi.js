const amqp = require("amqplib");

async function receive() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });
   
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("waiting dor msg => ",queue);

    await channel.bindQueue(queue.queue,exchange,"");

    channel.consume(
        queue.queue,
        (msg) => {
          if (msg !== null) {
            console.log(
              `send sms notification content is ${msg.content.toString()}`
            );
            channel.ack(msg);
          }
        }
      );
  } catch (error) {
    console.log(error);
  }
}

receive();
