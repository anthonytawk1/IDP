import Joi from "joi";
import JoiDate from "@joi/date";

const JoiExtended = Joi.extend(JoiDate);

export const userValidation = {
  signup: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      dob: JoiExtended.date().format("YYYY-MM-DD").utc(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  viewProfile: {
    params: Joi.string().required(),
  },
};

export default userValidation;
