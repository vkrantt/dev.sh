import { jwtDecode } from "jwt-decode";

export const getUserDetail = () => {
  const token = JSON.parse(localStorage.getItem("dsh_token"));
  if (token) {
    const decoded = jwtDecode(token);
    return decoded;
  }
};
