import userModel from "../users/models/user.model";
import errorCodes from "../../configs/error-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../configs/config";
import { EditProfileDto } from "./edit-profile.dto";
interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: Date;
}

class UserService {
  async createNewUser(user: User) {
    const { firstName, lastName, email, password, dob } = user;
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPass,
      dob,
    });
    return await newUser.save();
  }

  async signup(user: User) {
    const userFound = await userModel.findOne({ email: user.email });
    if (userFound) {
      throw new Error(errorCodes.conflictUser.message);
    } else {
      await this.createNewUser(user);
    }
  }

  async login(user: User) {
    const { email, password } = user;
    const userFound = await userModel.findOne({ email });
    if (!userFound) {
      throw new Error(errorCodes.unauthorized.message);
    }
    const isEqual = await bcrypt.compare(password, userFound.password);
    const passwordAttemptsLeft = userFound.passwordAttemptsLeft;
    if (!isEqual && passwordAttemptsLeft !== 0) {
      userFound.passwordAttemptsLeft -= 1;
      await userFound.save();
      throw new Error(errorCodes.unauthorized.message);
    }

    if (userFound.isLocked) {
      throw new Error(errorCodes.unauthorized.message);
    }

    if (userFound.passwordAttemptsLeft === 0) {
      await this.lockUser(userFound._id);
      throw new Error(errorCodes.unauthorized.message);
    }

    const token = jwt.sign(
      {
        email: userFound.email,
        userId: userFound._id.toString(),
      },
      config.jwt.accessToken as string,
      { expiresIn: "1h" }
    );
    return {
      token,
    };
  }

  async getUserById(userId: string) {
    const userFteched = await userModel.findById(userId);
    if (!userFteched) {
      throw new Error(errorCodes.notFound.message);
    }
    const user = {
      userId: userFteched._id,
      firstName: userFteched.firstName,
      lastName: userFteched.lastName,
      email: userFteched.email,
      dob: userFteched.dob,
    };
    return user;
  }

  async editProfile(userId: string, body: EditProfileDto) {
    const result = await userModel.findByIdAndUpdate({ _id: userId }, body);
    if (!result) {
      throw new Error(errorCodes.notFound.message);
    }
    return result;
  }

  async lockUser(userId: string) {
    return userModel.updateOne({ _id: userId }, { $set: { isLocked: true } });
  }
}

export default UserService;
