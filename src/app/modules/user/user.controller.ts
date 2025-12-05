import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";



const register = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.register(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User registered successfully',
        data: result
    });
});

export const UserController = {
    register
};