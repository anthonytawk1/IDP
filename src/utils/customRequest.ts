import { Request } from "express";

interface CustomRequest extends Request {
  userId?: string;
  email?: string;
  logId?: Object;
}

export default CustomRequest;
