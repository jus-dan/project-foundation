import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { config } from 'dotenv';

// Load environment variables
config();

// Import route modules
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import organizationRoutes from './routes/organizations';
import projectRoutes from './routes/projects';
import resourceRoutes from './routes/resources';
import categoryRoutes from './routes/categories';

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env['LOG_LEVEL'] || 'info',
  },
  trustProxy: true,
});

// Register plugins
async function registerPlugins() {
  // Security
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  // CORS
  await fastify.register(cors, {
    origin: process.env['ALLOWED_ORIGINS']?.split(',') || [
      'http://localhost:3000',
      'https://project-foundation-frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (_request, context) => ({
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after,
    }),
  });

  // JWT
  await fastify.register(jwt, {
    secret: process.env['JWT_SECRET'] || 'your-secret-key',
    cookie: {
      cookieName: 'token',
      signed: true,
    },
  });

  // Cookies
  await fastify.register(cookie, {
    secret: process.env['COOKIE_SECRET'] || 'your-cookie-secret',
  });

  // Swagger documentation
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Project Foundation API',
        description: 'Universal foundation API for various projects',
        version: '1.0.0',
      },
      host: process.env['API_HOST'] || 'localhost:3001',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (_request, _reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(userRoutes, { prefix: '/api/users' });
  fastify.register(organizationRoutes, { prefix: '/api/organizations' });
  fastify.register(projectRoutes, { prefix: '/api/projects' });
  fastify.register(resourceRoutes, { prefix: '/api/resources' });
  fastify.register(categoryRoutes, { prefix: '/api/categories' });

  // Protected routes example
  fastify.register(async function (fastify) {
    fastify.addHook('preHandler', authenticateToken);
    
    fastify.get('/api/protected', async (_request, _reply) => {
      return { message: 'This is a protected route', user: _request.user };
    });
  });
}

// Error handling
fastify.setErrorHandler(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await fastify.close();
    fastify.log.info('Server closed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();
    
    const port = parseInt(process.env['PORT'] || '3001');
    const host = process.env['HOST'] || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    fastify.log.info(`Server is running on http://${host}:${port}`);
    fastify.log.info(`API Documentation available at http://${host}:${port}/docs`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export default fastify;
