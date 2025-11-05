const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  const token = req.cookies.customer_token; // or whatever you named the cookie

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.CUSTOMER_SECRET_KEY || "customer_secret");
    req.user = decoded; // Attach payload to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = userAuth;