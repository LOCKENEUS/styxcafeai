// utils/auth.js
import jwt_decode from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwt_decode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true; // Invalid token
  }
}
