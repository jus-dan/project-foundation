import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function categoryRoutes(fastify: FastifyInstance) {
  // Get all categories
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Create category
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, color, organizationId, parentId } = request.body as any;

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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });
}
