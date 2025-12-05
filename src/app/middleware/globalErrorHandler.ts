import { Prisma } from "../../../prisma/generated/prisma/client";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const sanitizeError = (error: any) => {
    if (process.env.NODE_ENV === "production" && error.code?.startsWith("P")) {
        return {
            message: "Database operation failed",
            errorDetails: null,
        };
    }
    return error;
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = 'Duplicate key error',
                error = err.meta,
                statusCode = httpStatus.CONFLICT
        }
        if (err.code === 'P1000') {
            message = 'Authentication failed',
                error = err.meta,
                statusCode = httpStatus.BAD_GATEWAY
        }
        if (err.code === 'P2003') {
            message = 'Foreign key constraint failed',
                error = err.meta,
                statusCode = httpStatus.BAD_GATEWAY
        }
        if (err.code === 'P2025') {
            message = 'Wrong credentials',
                error = err.meta,
                statusCode = httpStatus.NOT_FOUND
        }
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation error",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown request error",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = "Prisma intialization error",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    const sanitizedError = sanitizeError(error);

    res.status(statusCode).json({
        success,
        message,
        error: sanitizeError
    })
};

export default globalErrorHandler;