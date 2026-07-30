import type { Request, Response, NextFunction } from "express";
import sendResponse from "../utility/sendResponse";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    sendResponse(res, {
        statusCode: 500,
        success: false,
        message: err.message || `Internal Server Error`
    });
}

export default globalErrorHandler;