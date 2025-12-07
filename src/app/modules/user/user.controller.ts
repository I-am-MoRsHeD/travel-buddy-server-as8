import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { convertExpireToMS } from "../../helpers/convertExpireToMS";
import config from "../../../config";



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

const login = catchAsync(async (req: Request, res: Response) => {
    const accessTokenExpiresIn = config.jwt.jwt_access_expires as string;
    const refreshTokenExpiresIn = config.jwt.jwt_refresh_expires as string;

    const accessTokenMS = convertExpireToMS(accessTokenExpiresIn);
    const refreshTokenMS = convertExpireToMS(refreshTokenExpiresIn)

    const result = await UserService.login(req.body);
    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: accessTokenMS
    });
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: refreshTokenMS
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully',
        data: null
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
    getAllUsers,
    getMyProfile,
    register,
    login,
    updateProfile,
};