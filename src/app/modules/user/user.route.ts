import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userRegisterZodSchema, userUpdateInfoZodSchema } from "./user.validation";
import checkAuth from "../../middleware/checkAuth";
import { fileUploader } from "../../helpers/fileUploader";
import { UserRole } from "../../../../prisma/generated/prisma/enums";


const router = Router();

router.get("/all",
    checkAuth(UserRole.ADMIN, UserRole.USER),
    UserController.getAllUsers);

router.get(
    '/me',
    checkAuth(UserRole.ADMIN, UserRole.USER),
    UserController.getMyProfile
)

router.post('/register',
    validateRequest(userRegisterZodSchema),
    UserController.register);

router.patch('/update/:id',
    checkAuth(UserRole.USER, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    validateRequest(userUpdateInfoZodSchema),
    UserController.updateProfile);

export const userRoutes = router;