const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../component/auth/model/model");
const jwt_secret = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (email !== process.env.ADMIN) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during authorization" });
  }
};
