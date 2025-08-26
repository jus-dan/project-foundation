"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = categoryRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function categoryRoutes(fastify) {
    // Get all categories
    fastify.get('/', async (request, reply) => {
        try {
            const categories = await prisma.category.findMany({
                include: {
                    organization: true,
                    parent: true,
                    children: true
                }
            });
            return reply.send({
                success: true,
                categories
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
    // Create category
    fastify.post('/', async (request, reply) => {
        try {
            const { name, description, color, organizationId, parentId } = request.body;
            const category = await prisma.category.create({
                data: {
                    name,
                    description,
                    color,
                    organizationId,
                    parentId
                }
            });
            return reply.status(201).send({
                success: true,
                category
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
//# sourceMappingURL=categories.js.map