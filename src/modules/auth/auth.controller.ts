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

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.getUserFromDB(Number(req.params.id));
        sendResponse(res, { statusCode: 200, success: true, data: result });
    } catch (error: any) {
        sendResponse(res, { statusCode: 404, success: false, message: error.message });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.updateUserInDB(Number(req.params.id), req.body);
        sendResponse(res, { statusCode: 200, success: true, message: "User updated", data: result });
    } catch (error: any) {
        sendResponse(res, { statusCode: 500, success: false, message: error.message });
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        await authService.deleteUserFromDB(Number(req.params.id));
        sendResponse(res, { statusCode: 200, success: true, message: "User deleted successfully" });
    } catch (error: any) {
        sendResponse(res, { statusCode: 500, success: false, message: error.message });
    }
}

// Update your export
export const authController = {
    userRegistration,
    userLogin,
    getUser,
    updateUser,
    deleteUser
}