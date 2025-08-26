import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function resourceRoutes(fastify: FastifyInstance) {
  // Get all resources
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Create resource
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, type, url, organizationId, categoryId } = request.body as any;

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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });
}
