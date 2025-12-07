import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";


const getReviewsById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ReviewService.getReviewsById(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result
    });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ReviewService.createReview(id as string, user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review is given successfully',
        data: result
    });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ReviewService.updateReview(id as string, user, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: result
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ReviewService.deleteReview(id as string, user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully',
        data: result
    });
});


export const ReviewController = {
    getReviewsById,
    createReview,
    updateReview,
    deleteReview
}