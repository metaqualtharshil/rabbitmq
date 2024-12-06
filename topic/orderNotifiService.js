const amqp = require("amqplib");

async function receive() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const queue = "orderQueue";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, "order.*");

    console.log("awiting for msg");

    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `order notification msg was cosumed with ${
              msg.fields.routingKey
            } and content is ${msg.content.toString()}`
          );
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

receive();
