import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import socketio from 'socket.io';
import morgan from 'morgan';
import amqp from 'amqplib/callback_api';

const opt = {
  credentials: amqp.credentials.plain('rabbitmq', 'rabbitmq'),
};
const amqpUrl = 'amqp://localhost';

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketio(this.server);
    this.amqpChannel = null;

    // Middleware
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));

    // Socket.IO setup
    this.io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    // RabbitMQ setup
    amqp.connect(amqpUrl, opt, (er, conn) => {
      if (er) {
        console.log(er.stack);
        console.error(er.stack);
        process.exit(1);
      }
      conn.createChannel((err, channel) => {
        if (err) {
          console.error(err.stack);
          process.exit(1);
        }
        this.amqpChannel = channel;
        console.log('RabbitMQ channel created');
      });
    });
  }

  start(port) {
    this.server.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  }

  stop() {
    this.server.close();
  }
}
export default App;
