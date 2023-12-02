import React from "react";
import { Navigate } from "react-router-dom";

const AdminAuthguard = ({ children, isAdmin }) => {
  const token = localStorage.getItem("dsh_token");
  return token && isAdmin ? children : <Navigate to="/" />;
};

export default AdminAuthguard;
