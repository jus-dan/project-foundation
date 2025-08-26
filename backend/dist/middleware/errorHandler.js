"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
async function errorHandler(error, request, reply) {
    // Log error
    request.log.error(error);
    // Handle Prisma errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return reply.status(409).send({
                    error: 'Conflict',
                    message: 'Ein Eintrag mit diesen Daten existiert bereits',
                    code: error.code
                });
            case 'P2025':
                return reply.status(404).send({
                    error: 'Not Found',
                    message: 'Der angeforderte Eintrag wurde nicht gefunden',
                    code: error.code
                });
            case 'P2003':
                return reply.status(400).send({
                    error: 'Bad Request',
                    message: 'Ungültige Referenz auf einen anderen Eintrag',
                    code: error.code
                });
            default:
                return reply.status(400).send({
                    error: 'Database Error',
                    message: 'Datenbankfehler aufgetreten',
                    code: error.code
                });
        }
    }
    // Handle Prisma validation errors
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Validierungsfehler bei den Eingabedaten',
            details: error.message
        });
    }
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        return reply.status(401).send({
            error: 'Invalid Token',
            message: 'Ungültiger JWT Token'
        });
    }
    if (error.name === 'TokenExpiredError') {
        return reply.status(401).send({
            error: 'Token Expired',
            message: 'JWT Token ist abgelaufen'
        });
    }
    // Handle validation errors
    if (error.validation) {
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Validierungsfehler bei den Eingabedaten',
            details: error.validation
        });
    }
    // Handle rate limit errors
    if (error.statusCode === 429) {
        return reply.status(429).send({
            error: 'Too Many Requests',
            message: 'Zu viele Anfragen. Bitte warten Sie einen Moment.',
            retryAfter: error.headers?.['retry-after']
        });
    }
    // Handle specific HTTP status codes
    if (error.statusCode) {
        const statusCode = error.statusCode;
        const message = error.message || 'Ein Fehler ist aufgetreten';
        return reply.status(statusCode).send({
            error: getStatusText(statusCode),
            message,
            statusCode
        });
    }
    // Default error response
    const isDevelopment = process.env['NODE_ENV'] === 'development';
    return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Ein interner Serverfehler ist aufgetreten',
        ...(isDevelopment && {
            stack: error.stack,
            details: error.message
        })
    });
}
function getStatusText(statusCode) {
    const statusTexts = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
    };
    return statusTexts[statusCode] || 'Unknown Error';
}
// Custom error classes
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=errorHandler.js.map