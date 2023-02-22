import App from './core/app';
import './core/env';

const main = async () => {
  const server = new App();
  server.start(process.env.PORT);
};

main();
