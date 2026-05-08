const { verifyToken } = require('../middleware/auth');

async function routes (fastify, options) {
    
  // A simple proxy to forward requests to the planner service
  fastify.post('/api/planner/*', { preValidation: [verifyToken] }, async (request, reply) => {
      const plannerUrl = process.env.PLANNER_URL || 'http://localhost:8000';
      const path = request.url.replace('/api/planner', '');
      
      try {
          const response = await fetch(`${plannerUrl}${path}`, {
              method: request.method,
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(request.body)
          });
          
          const data = await response.json();
          return reply.status(response.status).send(data);
      } catch (error) {
          fastify.log.error('Proxy to planner failed:', error);
          return reply.status(500).send({ error: 'Planner service unavailable' });
      }
  });

  fastify.get('/health', async (request, reply) => {
      return { status: 'ok', service: 'gateway' };
  });
}

module.exports = routes;
