import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { ROLES } from "../types/roleTypes";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized access!"
                });
            }

            const decoded = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;

            if (decoded.id === null || decoded.id === undefined) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "User not found"
                });
            }

            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "You don't have permission to view this page"
                });
            }

            next();
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    };
};

export default auth;