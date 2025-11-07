const jwt = require("jsonwebtoken");
const jwt_secret = process.env.SUPERADMIN_SECRET_KEY;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Malformed authorization header" });
    }

    const token = parts[1];

    try {
      const payload = jwt.verify(token, jwt_secret);
      if (!payload.id) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      req.saId = payload.id;
      next();

    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

  } catch (err) {
    console.error("SuperAdmin authorization error:", err, {
      method: req.method,
      url: req.originalUrl,
    });
    return res
      .status(500)
      .json({ message: "Internal server error during authorization" });
  }
};