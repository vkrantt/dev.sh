import jwt from "jsonwebtoken";

const getToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default getToken;
