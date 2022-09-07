import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export function errorHandler(err: {message: string, stack: string}, req: Request, res: Response, next: NextFunction) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(err.message);
  logger.error(err.stack);
  res.status(statusCode).json({
    error: true,
    detail: {message: err.message, stack: process.env.NODE_ENV === "production" ? null : err.stack}
  });
};