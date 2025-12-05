import { Router } from "express";
import { AuthController } from "./auth.controller";
import checkAuth from "../../middleware/checkAuth";


const router = Router();

router.get(
    "/me",
    checkAuth(),
    AuthController.getMe
)

router.post('/login',
    AuthController.login);

export const authRoutes = router;