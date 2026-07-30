import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const userRegistration = async (req: Request, res: Response) => {
    try {
        const result = await authService.signupUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result
        });
    }
    catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
}

const userLogin = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login Successful",
            data: result
        });
    }
    catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            data: null
        });
    }
}

export const authController = {
    userRegistration,
    userLogin
}