import type { JwtPayload } from "jsonwebtoken";
import { UserStatus, type Prisma } from "../../../../prisma/generated/prisma/client";
import { prisma } from "../../../lib/prisma";


const getReviewsById = async (id: string) => {
    const result = await prisma.review.findMany({
        where: {
            reviewTo: id
        }
    });

    return result;
};

const createReview = async (reviewToId: string, user: JwtPayload, payload: Prisma.ReviewCreateInput) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: user.userId,
            status: UserStatus.ACTIVE
        }
    });

    const receivingUser = await prisma.user.findUniqueOrThrow({
        where: { id: reviewToId },
        select: {
            id: true,
            travelPlans: {
                select: {
                    interestedMembers: true,
                    creator_id: true
                }
            }
        }
    });

    if (reviewToId === user.userId)
        throw new Error("You cannot review yourself.");

    const alreadyReviewed = await prisma.review.findFirst({
        where: {
            reviewTo: reviewToId,
            reviewFrom: user.userId
        }
    });

    if (alreadyReviewed)
        throw new Error("You have already reviewed this user.");

    const receiverPlans = receivingUser.travelPlans;

    const reviewerInReceiverList = receiverPlans.some(plan =>
        plan.interestedMembers.includes(user.userId)
    );

    const reviewerPlans = await prisma.travelPlan.findMany({
        where: { creator_id: user.userId },
        select: { interestedMembers: true }
    });

    const receiverInReviewerList = reviewerPlans.some(plan =>
        plan.interestedMembers.includes(reviewToId)
    );

    if (!reviewerInReceiverList && !receiverInReviewerList) {
        throw new Error(
            "You can only review users who were part of your travel interactions."
        );
    }

    const newReview = await prisma.$transaction(async (tx) => {

        const createdReview = await tx.review.create({
            data: {
                rating: payload.rating,
                description: payload.description,
                reviewTo: reviewToId,
                reviewFrom: user.userId
            }
        });

        const ratings = await tx.review.findMany({
            where: { reviewTo: reviewToId },
            select: { rating: true }
        });

        const avgRating =
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        await tx.user.update({
            where: { id: reviewToId },
            data: { avgRating: Math.round(avgRating) }
        });

        return createdReview;
    });

    return newReview;
};

const updateReview = async (reviewId: string, user: JwtPayload, payload: Prisma.ReviewUpdateInput) => {
    const existingReview = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        },
        select: {
            id: true,
            reviewFrom: true,
            reviewTo: true
        }
    });

    if (existingReview.reviewFrom !== user.userId)
        throw new Error("You are not allowed to edit this review.");

    const receiverId = existingReview.reviewTo;

    const updatedReview = await prisma.$transaction(async (tx) => {
        const review = await tx.review.update({
            where: { id: reviewId },
            data: payload
        });

        const ratings = await tx.review.findMany({
            where: { reviewTo: receiverId },
            select: { rating: true }
        });

        const avgRating =
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        await tx.user.update({
            where: { id: receiverId },
            data: { avgRating: Math.round(avgRating) }
        });

        return review;
    });

    return updatedReview;
};

const deleteReview = async (reviewId: string, user: JwtPayload) => {
    const review = await prisma.review.findUniqueOrThrow({
        where: { id: reviewId },
        select: { id: true, reviewFrom: true, reviewTo: true }
    });

    if (review.reviewFrom !== user.userId)
        throw new Error("You are not allowed to delete this review.");

    const receiverId = review.reviewTo;

    await prisma.$transaction(async (tx) => {
        await tx.review.delete({
            where: { id: reviewId }
        });

        const ratings = await tx.review.findMany({
            where: { reviewTo: receiverId },
            select: { rating: true }
        });

        const newAvg = ratings.length
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        await tx.user.update({
            where: { id: receiverId },
            data: { avgRating: Math.round(newAvg) }
        });
    });

    return;
};

export const ReviewService = {
    getReviewsById,
    createReview,
    updateReview,
    deleteReview
};