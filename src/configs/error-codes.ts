export default {
  conflictUser: {
    statusCode: 409,
    message: "user already exits",
  },
  notFound: {
    statusCode: 404,
    message: "notFound",
  },
  internalServerError: {
    statusCode: 500,
    message: "internalServerError",
  },
  unauthorized: {
    statusCode: 401,
    message: "unauthorized",
  },
  forbidden: {
    statusCode: 403,
    message: "forbidden",
  },
};
