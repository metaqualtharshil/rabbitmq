const amqp = require("amqplib");

async function sendMessage( product) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });


    const message = JSON.stringify(product);

    channel.publish(
      exchange,
      "",
      Buffer.from(message),
      { persistent: true }
    );

    console.log("sent:",message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendMessage({ orderID: 12345, name: "one plus",price: "34,000" });
