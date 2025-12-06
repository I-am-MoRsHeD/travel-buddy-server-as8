import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";



const getAllUsers = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.getAllUsers(req.query);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Users retrieved successfully',
        data: result
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await UserService.getMyProfile(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

const register = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.register(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User registered successfully',
        data: result
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await UserService.updateProfile(id as string, user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Userinfo updated successfully',
        data: result
    });
});

export const UserController = {
    register,
    updateProfile,
    getAllUsers,
    getMyProfile,
};