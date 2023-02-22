const amqp = require('amqplib');

const host = 'amqp://localhost';
const opt = {
  credentials: amqp.credentials.plain('rabbitmq', 'rabbitmq'),
};

class RabbitMQ {
  constructor() {
    this.channel = null;
  }

  async connect() {
    const connection = await amqp.connect(host, opt);
    this.channel = await connection.createChannel();
    return this.channel;
  }

  async assertQueue(queueName, options = {}) {
    await this.channel.assertQueue(queueName, options);
  }

  async publish(queueName, message, options = {}) {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    await this.channel.sendToQueue(queueName, messageBuffer, options);
  }

  async consume(queueName, handler, options = {}) {
    await this.channel.consume(
      queueName,
      (message) => {
        const messageString = message.content.toString();
        const messageObject = JSON.parse(messageString);

        handler(messageObject);

        this.channel.ack(message);
      },
      options
    );
  }
}

export default RabbitMQ;

// io.on('connection', socket => {
//     console.log(`New client connected: ${socket.id}`);

//     socket.on('message', message => {
//       const messageBuffer = Buffer.from(JSON.stringify({ socketId: socket.id, message }));

//       channel.sendToQueue(queueName, messageBuffer);
//     });

//     socket.on('disconnect', () => {
//       console.log(`Client disconnected: ${socket.id

// const amqp = require('amqplib');
// const io = require('socket.io')(3000);

// const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';

// const connectRabbitMQ = async () => {
//   const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
//   const channel = await connection.createChannel();

//   const queueName = 'testQueue';

//   await channel.assertQueue(queueName);

//   channel.consume(queueName, (message) => {
//     if (message !== null) {
//       console.log(`Received message: ${message.content.toString()}`);
//       io.emit('message', message.content.toString());
//       channel.ack(message);
//     }
//   });
// };

// connectRabbitMQ().catch(console.error);
