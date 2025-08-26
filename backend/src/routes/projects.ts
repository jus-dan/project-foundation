import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function projectRoutes(fastify: FastifyInstance) {
  // Get all projects
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Create project
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, organizationId } = request.body as any;

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
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });
}
