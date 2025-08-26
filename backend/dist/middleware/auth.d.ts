import { FastifyRequest, FastifyReply } from 'fastify';
declare module 'fastify' {
    interface FastifyRequest {
        userContext?: {
            id: string;
            email: string;
            username: string;
            roles: string[];
            organizationId?: string;
        };
    }
}
export declare function authenticateToken(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
export declare function requireRole(allowedRoles: string[]): Promise<(request: FastifyRequest, reply: FastifyReply) => Promise<undefined>>;
export declare function requireOrganizationAccess(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
export declare function checkPermission(resource: string, action: string): Promise<(request: FastifyRequest, reply: FastifyReply) => Promise<undefined>>;
//# sourceMappingURL=auth.d.ts.map