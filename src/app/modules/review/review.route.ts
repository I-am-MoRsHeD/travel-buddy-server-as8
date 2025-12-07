import { Router } from "express";
import { ReviewController } from "./review.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { createReviewZodSchema, updateReviewZodSchema } from "./review.validation";


const router = Router();

router.get("/:id",
    checkAuth(UserRole.USER, UserRole.ADMIN),
    ReviewController.getReviewsById);

router.post('/',
    checkAuth(UserRole.USER),
    validateRequest(createReviewZodSchema),
    ReviewController.createReview);

router.patch('/:id',
    checkAuth(UserRole.USER),
    validateRequest(updateReviewZodSchema),
    ReviewController.updateReview);
router.delete('/:id',
    checkAuth(UserRole.USER),
    ReviewController.deleteReview);

export const reviewRoutes = router;