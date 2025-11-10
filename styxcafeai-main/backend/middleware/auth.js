const jwt = require("jsonwebtoken");

const adminSecret = process.env.SECRET_KEY;
const superadminSecret = process.env.SUPERADMIN_SECRET_KEY;

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

    // First try verifying with superadmin secret
    try {
      const superadminPayload = jwt.verify(token, superadminSecret);
      req.SuperAdminId = superadminPayload.id;
      req.userRole = "superadmin";
      return next();
    } catch (err) {
      // Do nothing, fallback to admin verification
    }

    // If superadmin verification fails, try admin
    try {
      const adminPayload = jwt.verify(token, adminSecret);
      req.AdminId = adminPayload.id;
      req.userRole = "admin";
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

  } catch (err) {
    console.error("Authorization middleware error:", err, {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(500).json({ message: "Internal server error during authorization" });
  }
};

