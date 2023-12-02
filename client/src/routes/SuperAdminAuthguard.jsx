import React from "react";
import { Navigate } from "react-router-dom";

const SuperAdminAuthguard = ({ children, isSuperAdmin }) => {
  const token = localStorage.getItem("dsh_token");
  return token && isSuperAdmin ? children : <Navigate to="/" />;
};

export default SuperAdminAuthguard;
