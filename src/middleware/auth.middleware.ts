import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import config from "../configs/config";
import CustomRequest from "../utils/customRequest";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): any => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, config.jwt.accessToken as string, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  });
};
