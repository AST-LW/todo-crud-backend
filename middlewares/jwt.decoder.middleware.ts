import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const jwtDecoderMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let bearerToken = req.headers["authorization"];

    if (!bearerToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bearer token is not provided" });
    }

    bearerToken = bearerToken.split(" ")[1];
    jwt.verify(bearerToken, "helloworld", (err, decoded) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Failed to authenticate token" });
        }
        // Attach decoded token payload to request object for further use
        (req as any).user_id = (decoded as any).user_id;
        next();
    });
};
