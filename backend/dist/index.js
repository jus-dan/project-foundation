"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const dotenv_1 = require("dotenv");
// Load environment variables
(0, dotenv_1.config)();
// Import route modules
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const organizations_1 = __importDefault(require("./routes/organizations"));
const projects_1 = __importDefault(require("./routes/projects"));
const resources_1 = __importDefault(require("./routes/resources"));
const categories_1 = __importDefault(require("./routes/categories"));
// Import middleware
const auth_2 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
// Create Fastify instance
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env['LOG_LEVEL'] || 'info',
    },
    trustProxy: true,
});
// Register plugins
async function registerPlugins() {
    // Security
    await fastify.register(helmet_1.default, {
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
    await fastify.register(cors_1.default, {
        origin: process.env['ALLOWED_ORIGINS']?.split(',') || [
            'http://localhost:3000',
            'https://project-foundation-frontend.vercel.app'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Rate limiting
    await fastify.register(rate_limit_1.default, {
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
    await fastify.register(jwt_1.default, {
        secret: process.env['JWT_SECRET'] || 'your-secret-key',
        cookie: {
            cookieName: 'token',
            signed: true,
        },
    });
    // Cookies
    await fastify.register(cookie_1.default, {
        secret: process.env['COOKIE_SECRET'] || 'your-cookie-secret',
    });
    // Swagger documentation
    await fastify.register(swagger_1.default, {
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
    await fastify.register(swagger_ui_1.default, {
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
    fastify.register(auth_1.default, { prefix: '/api/auth' });
    fastify.register(users_1.default, { prefix: '/api/users' });
    fastify.register(organizations_1.default, { prefix: '/api/organizations' });
    fastify.register(projects_1.default, { prefix: '/api/projects' });
    fastify.register(resources_1.default, { prefix: '/api/resources' });
    fastify.register(categories_1.default, { prefix: '/api/categories' });
    // Protected routes example
    fastify.register(async function (fastify) {
        fastify.addHook('preHandler', auth_2.authenticateToken);
        fastify.get('/api/protected', async (_request, _reply) => {
            return { message: 'This is a protected route', user: _request.user };
        });
    });
}
// Error handling
fastify.setErrorHandler(errorHandler_1.errorHandler);
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    fastify.log.info(`Received ${signal}. Starting graceful shutdown...`);
    try {
        await fastify.close();
        fastify.log.info('Server closed successfully');
        process.exit(0);
    }
    catch (err) {
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
    }
    catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
}
// Start the server if this file is run directly
if (require.main === module) {
    start();
}
exports.default = fastify;
//# sourceMappingURL=index.js.map