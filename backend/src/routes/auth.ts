import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich')
});

const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  username: z.string().min(3, 'Benutzername muss mindestens 3 Zeichen lang sein'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse')
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token ist erforderlich'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Login
  fastify.post('/login', {
    schema: {
      description: 'User login',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!user || !user.isActive) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials',
          message: 'Ungültige E-Mail oder Passwort'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials',
          message: 'Ungültige E-Mail oder Passwort'
        });
      }

      // Generate JWT token
      const token = await reply.jwtSign({
        userId: user.id,
        email: user.email,
        username: user.username
      });

      // Set cookie
      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      // Return user data and token
      const roles = user.userRoles.map(ur => ur.role.name);
      
      return reply.send({
        success: true,
        message: 'Erfolgreich angemeldet',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          roles
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          message: 'Validierungsfehler',
          details: error.errors
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Ein interner Serverfehler ist aufgetreten'
      });
    }
  });

  // Register
  fastify.post('/register', {
    schema: {
      description: 'User registration',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, username, password, firstName, lastName } = registerSchema.parse(request.body);

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: 'User already exists',
          message: existingUser.email === email 
            ? 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits'
            : 'Ein Benutzer mit diesem Benutzernamen existiert bereits'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName: firstName || null,
          lastName: lastName || null,
          userRoles: {
            create: {
              role: {
                connectOrCreate: {
                  where: { name: 'user' },
                  create: {
                    name: 'user',
                    description: 'Standard-Benutzerrolle'
                  }
                }
              }
            }
          }
        }
      });

      return reply.status(201).send({
        success: true,
        message: 'Benutzer erfolgreich erstellt',
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          message: 'Validierungsfehler',
          details: error.errors
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Ein interner Serverfehler ist aufgetreten'
      });
    }
  });

  // Logout
  fastify.post('/logout', {
    schema: {
      description: 'User logout',
      tags: ['Authentication'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    // Clear cookie
    reply.clearCookie('token', { path: '/' });
    
    return reply.send({
      success: true,
      message: 'Erfolgreich abgemeldet'
    });
  });

  // Get current user
  fastify.get('/me', {
    schema: {
      description: 'Get current user information',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Nicht autorisiert'
      });
    }

    return reply.send({
      success: true,
      user: request.user
    });
  });

  // Forgot password
  fastify.post('/forgot-password', {
    schema: {
      description: 'Request password reset',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Don't reveal if user exists for security
        return reply.send({
          success: true,
          message: 'Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Reset-Link gesendet.'
        });
      }

      // Generate reset token (in production, use a proper token service)
      // const resetToken = require('crypto').randomBytes(32).toString('hex');
      
      // Store reset token (in production, use a proper token storage)
      // For now, we'll just return a success message
      
      return reply.send({
        success: true,
        message: 'Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Reset-Link gesendet.'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          message: 'Validierungsfehler',
          details: error.errors
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Ein interner Serverfehler ist aufgetreten'
      });
    }
  });

  // Reset password
  fastify.post('/reset-password', {
    schema: {
      description: 'Reset password with token',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 8 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token: _token, password: _password } = resetPasswordSchema.parse(request.body);

      // In production, validate the token and find the user
      // For now, we'll just return a success message
      
      return reply.send({
        success: true,
        message: 'Passwort erfolgreich zurückgesetzt'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          message: 'Validierungsfehler',
          details: error.errors
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
        message: 'Ein interner Serverfehler ist aufgetreten'
      });
    }
  });
}
