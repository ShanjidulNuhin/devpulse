import { type Request, type Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.createIssueIntoDB(req.body, req.user?.id);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await issueService.getAllIssuesFromDB();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.getSingleIssueFromDB(Number(req?.params?.id));

        if (!result.id) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: `Issue with id ${req?.params?.id} not found`,
            });
            return;
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            data: result
        });
    } 
    catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const updateIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.updateIssueIntoDB(Number(req?.params?.id), req);

        if(!result) {
            sendResponse(res, {
                statusCode: 409,
                success: false,
                message: `Issue already resolved!`
            });
            return;
        }

        if (result?.rowCount !== 1) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: `Issue with id ${req?.params?.id} not found`
            });
            return;
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0]
        });
    } 
    catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.deleteIssueFromDB(Number(req?.params?.id));

        if (result.rowCount !== 1) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: `Issue with id ${req?.params?.id} not found`,
                data: null
            });
            return;
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully"
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}