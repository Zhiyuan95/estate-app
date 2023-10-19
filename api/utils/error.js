//we manualy create this error to handle some specific case, like password doesn't match requirement

export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;

  return error;
};
