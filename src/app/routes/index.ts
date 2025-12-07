import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { travelRoutes } from "../modules/travel-plan/travelPlan.route";


const router = Router();


const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/travel',
        route: travelRoutes
    },
]


moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;