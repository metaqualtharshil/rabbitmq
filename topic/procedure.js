const amqp = require("amqplib");

async function sendMessage(routingkey, message) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "notification_exchange";
    const exchangeType = "topic";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    channel.publish(
      exchange,
      routingkey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    console.log(" [x] Sent %s:'%s'", routingkey, JSON.stringify(message));
    console.log(
      `Mes was send with routing key is ${routingkey} and content as ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendMessage("order.palced", { orderID: 12345, status: "placed" });
sendMessage("payment.processed", { orderID: 6789, status: "processed" });
