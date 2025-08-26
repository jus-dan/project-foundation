"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = projectRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function projectRoutes(fastify) {
    // Get all projects
    fastify.get('/', async (request, reply) => {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    organization: true
                }
            });
            return reply.send({
                success: true,
                projects
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
    // Create project
    fastify.post('/', async (request, reply) => {
        try {
            const { name, description, organizationId } = request.body;
            const project = await prisma.project.create({
                data: {
                    name,
                    description,
                    organizationId
                }
            });
            return reply.status(201).send({
                success: true,
                project
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
//# sourceMappingURL=projects.js.map