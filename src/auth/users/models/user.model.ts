import mongoose, { Schema, Document, Model } from "mongoose";
import config from "../../../configs/config";

interface User {
  email: string;
  dob: Date;
  firstName: string;
  lastName: string;
  password: string;
  passwordAttemptsLeft: number;
  isLocked: boolean;
}

interface UserDocument extends User, Document {}

const userSchema: Schema<UserDocument> = new Schema(
  {
    email: String,
    dob: Date,
    firstName: String,
    lastName: String,
    password: String,
    passwordAttemptsLeft: {
      type: Number,
      default: 10,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  config.modelNames.user,
  userSchema
);
userSchema.index({email: 1})
export default UserModel;
