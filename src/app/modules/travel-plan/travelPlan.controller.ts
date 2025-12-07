import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { TravelPlanService } from "./travelPlan.service";


const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await TravelPlanService.createTravelPlan(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Travel created successfully',
        data: result
    });
});


const getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await TravelPlanService.getMyTravelPlans(user, req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plans retrieved successfully',
        data: result
    });
});

const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await TravelPlanService.getAllTravelPlans(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All travel plans retrieved successfully',
        data: result
    });
});

const updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await TravelPlanService.updateTravelPlan(id as string, user, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan updated successfully',
        data: result
    });
});

const updateTravelStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TravelPlanService.updateTravelStatus(id as string, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan status updated successfully',
        data: result
    });
});

const deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await TravelPlanService.deleteTravelPlan(id as string, user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan deleted successfully',
        data: result
    });
});



export const TravelController = {
    createTravelPlan,
    getMyTravelPlans,
    getAllTravelPlans,
    updateTravelPlan,
    updateTravelStatus,
    deleteTravelPlan
}
