const throwError = (res, msg) => {
  res.status(404);
  const error = new Error();
  error.message = msg;
  throw error;
};
export default throwError;
