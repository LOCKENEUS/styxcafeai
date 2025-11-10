const rateLimit = require('express-rate-limit');

// General login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 5 requests per window per IP
  skipSuccessfulRequests: true, // Skip counting successful login attempts
  message: {
    status: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Password reset limiter
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 OTP requests per window per IP
  message: {
    status: false,
    message: "Too many OTP requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  otpLimiter,
};
