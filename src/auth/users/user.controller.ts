import express, { Request, Response } from "express";
import UserService from "./user.service";
import { userValidation } from "./user.validation";
import { validate } from "express-validation";
import errorCode from "../../configs/error-codes";
import { verifyToken } from "../../middleware/auth.middleware";
import CustomRequest from "../../utils/customRequest";

class UserController {
  public path = "/user";
  public router = express.Router();
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.initializeRoutes();
  }

  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.signup(req.body);
      res.send(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === errorCode.conflictUser.message
      ) {
        res
          .status(errorCode.conflictUser.statusCode)
          .send(errorCode.conflictUser.message);
      } else {
        res.status(errorCode.internalServerError.statusCode).send(error);
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.login(req.body);
      res.send(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === errorCode.unauthorized.message
      ) {
        res
          .status(errorCode.unauthorized.statusCode)
          .send(errorCode.unauthorized);
      } else {
        res.status(errorCode.internalServerError.statusCode).send(error);
      }
    }
  };

  public viewProfile = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.userService.getUserById(userId);
      res.send(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === errorCode.unauthorized.message
      ) {
        res
          .status(errorCode.unauthorized.statusCode)
          .send(errorCode.unauthorized.message);
      } else {
        res.status(errorCode.internalServerError.statusCode).send(error);
      }
    }
  };

  public editProfile = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.userService.editProfile(userId, req.body);
      res.send(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === errorCode.unauthorized.message
      ) {
        res
          .status(errorCode.unauthorized.statusCode)
          .send(errorCode.unauthorized.message);
      } else {
        res.status(errorCode.internalServerError.statusCode).send(error);
      }
    }
  };

  public verifyTokenAndGetUserInfo = async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.userService.getUserById(userId);
      res.send(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === errorCode.unauthorized.message
      ) {
        res
          .status(errorCode.unauthorized.statusCode)
          .send(errorCode.unauthorized.message);
      } else {
        res.status(errorCode.internalServerError.statusCode).send(error);
      }
    }
  };

  public initializeRoutes(): void {
    this.router.get(
      `${this.path}/verify-token`,
      verifyToken,
      this.verifyTokenAndGetUserInfo
    );
    this.router.post(
      `${this.path}/signup`,
      validate(userValidation.signup),
      this.signup
    );
    this.router.post(
      `${this.path}/login`,
      validate(userValidation.login),
      this.login
    );
    this.router.get(`${this.path}/view-profile`, verifyToken, this.viewProfile);
    this.router.put(`${this.path}/edit-profile`, verifyToken, this.editProfile);
  }
}

export default UserController;
