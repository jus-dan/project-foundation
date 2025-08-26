"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function userRoutes(fastify) {
    // Get all users
    fastify.get('/', async (request, reply) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    createdAt: true,
                    userRoles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
            return reply.send({
                success: true,
                users
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
    // Get user by ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    createdAt: true,
                    userRoles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found'
                });
            }
            return reply.send({
                success: true,
                user
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
    // Update user
    fastify.put('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const { firstName, lastName, isActive } = request.body;
            const user = await prisma.user.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    isActive
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    updatedAt: true
                }
            });
            return reply.send({
                success: true,
                user
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
    // Delete user
    fastify.delete('/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            await prisma.user.delete({
                where: { id }
            });
            return reply.send({
                success: true,
                message: 'User deleted successfully'
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
//# sourceMappingURL=users.js.map