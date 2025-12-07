import { Router } from "express";
import { TravelController } from "./travelPlan.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { createTravelPlanZodSchema, updateTravelPlanStatusZodSchema, updateTravelPlanZodSchema } from "./travelPlan.validation";


const router = Router();


router.get("/all",
    TravelController.getAllTravelPlans);

router.get('/me',
    checkAuth(UserRole.USER),
    TravelController.getMyTravelPlans);

router.post('/create',
    checkAuth(UserRole.USER),
    validateRequest(createTravelPlanZodSchema),
    TravelController.createTravelPlan);

router.patch('/:id',
    checkAuth(UserRole.USER),
    validateRequest(updateTravelPlanZodSchema),
    TravelController.updateTravelPlan);

router.patch('/:id/status',
    checkAuth(UserRole.ADMIN),
    validateRequest(updateTravelPlanStatusZodSchema),
    TravelController.updateTravelStatus);

router.delete('/:id',
    checkAuth(UserRole.USER),
    TravelController.deleteTravelPlan);

export const travelRoutes = router;