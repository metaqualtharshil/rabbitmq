const amqp = require("amqplib");

async function receiveMsg() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("send_mail_subscribeUser", { durable: true });

    channel.consume("send_mail_subscribeUser", (message) => {
      if (message !== null) {
        console.log("recev msg send_mail_subscribeUser:", JSON.parse(message.content));
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
receiveMsg();
