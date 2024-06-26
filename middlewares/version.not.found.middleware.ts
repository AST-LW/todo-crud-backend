import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// Define a middleware function for handling version not found errors
export const versionNotFoundMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Check if a property indicating version not found exists on the request object
    if ((req as any).versionNotFound) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: "Version of API does not exist",
        });
    }

    // If the property doesn't exist, continue to the next middleware
    next();
};
