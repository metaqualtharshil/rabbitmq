const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "mail_exchange";
    const routingKeySubscribeUser = "send_mail_subscribeUser";
    const routingKeyUser = "send_mail_user";

    const message = {
      to: "venom@gmail.com",
      from: "venom@gmail.com",
      subject: "order placed",
      body: "hello venom",
    };

    // exchange is decode to which is route
    await channel.assertExchange(exchange, "direct", { durable: false });
    //exchange binding with queue
    await channel.assertQueue(
      "send_mail_subscribeUser",
      exchange,
      routingKeySubscribeUser
    );
    await channel.assertQueue("send_mail_user", exchange, routingKeyUser);

    // defining queue
    await channel.bindQueue(
      "send_mail_subscribeUser",
      exchange,
      routingKeySubscribeUser
    );
    await channel.bindQueue("send_mail_user", exchange, routingKeyUser);

    channel.publish(
      exchange,
      routingKeyUser,
      Buffer.from(JSON.stringify(message))
    );

    console.log("mail data was sent: ", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

sendMail();
