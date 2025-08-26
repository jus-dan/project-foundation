"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = resourceRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function resourceRoutes(fastify) {
    // Get all resources
    fastify.get('/', async (request, reply) => {
        try {
            const resources = await prisma.resource.findMany({
                include: {
                    organization: true,
                    category: true
                }
            });
            return reply.send({
                success: true,
                resources
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
    // Create resource
    fastify.post('/', async (request, reply) => {
        try {
            const { name, description, type, url, organizationId, categoryId } = request.body;
            const resource = await prisma.resource.create({
                data: {
                    name,
                    description,
                    type,
                    url,
                    organizationId,
                    categoryId
                }
            });
            return reply.status(201).send({
                success: true,
                resource
            });
        }
        catch (error) {
            request.log.error(error);
            return reply.status(500).send({
                success: false,
                error: 'Internal server error'
            });
        }
    });
}
//# sourceMappingURL=resources.js.map