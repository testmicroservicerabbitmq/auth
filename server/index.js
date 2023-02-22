import App from './core/app';
import MQ from './core/rabbitmq';
import './core/env';

const main = async () => {
  const server = new App();
  const mq = new MQ();
  mq.connect();
  server.start(process.env.PORT);
};

main();
