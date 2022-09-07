import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { logger } from "../logger";
import { UserModel } from "../models";

export const authHandler = asyncHandler(async (req: any, res: any, next: any) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);

      req.user = await UserModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      logger.error("Not authorized, token failed");
      res.status(401).json({error: true, detail: "Not authorized, token failed!"});
    };
  };

  if (!token) {
    res.status(401).json({error: true, detail: "Not authorized, no token!"});
    logger.error("Not authorized, no token!");
  };
});