"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = organizationRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function organizationRoutes(fastify) {
    // Get all organizations
    fastify.get('/', async (request, reply) => {
        try {
            const organizations = await prisma.organization.findMany({
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            });
            return reply.send({
                success: true,
                organizations
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
    // Create organization
    fastify.post('/', async (request, reply) => {
        try {
            const { name, description, slug } = request.body;
            const organization = await prisma.organization.create({
                data: {
                    name,
                    description,
                    slug,
                    createdBy: 'system' // In production, get from authenticated user
                }
            });
            return reply.status(201).send({
                success: true,
                organization
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
//# sourceMappingURL=organizations.js.map