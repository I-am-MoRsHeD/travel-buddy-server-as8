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



export const TravelController = {
    createTravelPlan
}
