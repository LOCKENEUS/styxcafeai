// utils/decodeToken.js

export async function decodeToken(token) {
    try {
      const mod = await import('jwt-decode');
      const jwt_decode = mod.default || mod;
      return jwt_decode(token);
    } catch (err) {
      console.error("Token decode error:", err);
      return null;
    }
  }
  