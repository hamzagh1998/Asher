import { Router } from "express";

import { AuthController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", AuthController.registerController);
authRouter.post("/login", AuthController.loginController);

export { authRouter };