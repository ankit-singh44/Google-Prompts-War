const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
require('dotenv').config();

fastify.register(cors, { 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

fastify.register(require('./routes/proxy'));

const start = async () => {
  try {
    const port = process.env.PORT || 8080;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`API Gateway running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
