import { Router } from "express";
import { TravelController } from "./travelPlan.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import { CreateTravelPlanSchema } from "./travelPlan.validation";


const router = Router();


router.post('/create',
    checkAuth(UserRole.USER),
    validateRequest(CreateTravelPlanSchema),
    TravelController.createTravelPlan);

export const travelRoutes = router;