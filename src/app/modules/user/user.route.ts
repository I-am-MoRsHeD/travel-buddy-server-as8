import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userRegisterZodSchema } from "./user.validation";


const router = Router();

router.post('/register',
    validateRequest(userRegisterZodSchema),
    UserController.register);

export const userRoutes = router;