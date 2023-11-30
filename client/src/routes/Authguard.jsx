import React from "react";
import { Navigate } from "react-router-dom";

const Authguard = ({ children }) => {
  const token = localStorage.getItem("dsh_token");
  return token ? children : <Navigate to="/" />;
};

export default Authguard;
