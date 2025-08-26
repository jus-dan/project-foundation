import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function organizationRoutes(fastify: FastifyInstance) {
  // Get all organizations
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Create organization
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, slug } = request.body as any;

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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });
}
