const User = require("../model/model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../../../utils/sendMail");
const Cafe = require("../../superadmin/cafe/model");
const Customer = require("../../admin/customer/model");
const { Twilio } = require("twilio");

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const registerCtrl = async (req, res) => {
  const userInfo = req.body;

  try {
    const user = new User({
      name: userInfo.name,
      email: userInfo.email,
      contact: userInfo.contact,
      password: userInfo.password,
      role: userInfo.role,
      cafe: userInfo.cafe,
      billingAddress: userInfo.billingAddress,
      shippingAddress: userInfo.shippingAddress,
      country1: userInfo.country1,
      country2: userInfo.country2,
      state1: userInfo.state1,
      state2: userInfo.state2,
      city1: userInfo.city1,
      city2: userInfo.city2,
      pincode1: userInfo.pincode1,
      pincode2: userInfo.pincode2,
      latitude1: userInfo.latitude1,
      latitude2: userInfo.latitude2,
      longitude1: userInfo.longitude1,
      longitude2: userInfo.longitude2,
      gstIn: userInfo.gstIn,
      pan: userInfo.pan,
    });

    const newUser = await user.save();

    res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        role: newUser.role,
        cafe: newUser.cafe,
        billingAddress: newUser.billingAddress,
        shippingAddress: newUser.shippingAddress,
        country1: newUser.country1,
        country2: newUser.country2,
        state1: newUser.state1,
        state2: newUser.state2,
        city1: newUser.city1,
        city2: newUser.city2,
        pincode1: newUser.pincode1,
        pincode2: newUser.pincode2,
        latitude1: newUser.latitude1,
        latitude2: newUser.latitude2,
        longitude1: newUser.longitude1,
        longitude2: newUser.longitude2,
        gstIn: newUser.gstIn,
        pan: newUser.pan,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
        error: err.message,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: err.message,
      });
    }
    res.status(500).json({
      message: "Failed to register user",
      error: err.message,
    });
  }
};

const customerRegisterCtrl = async (req, res) => {
  try {
    const {
      cafe,
      name,
      email,
      contact_no,
      age,
      address,
      gender,
      country,
      state,
      city,
      creditEligibility,
      creditLimit,
      creditAmount,
    } = req.body;

    // Check if a customer with the same contact number already exists for the specified cafe
    const existingCustomer = await Customer.findOne({
      cafe,
      contact_no,
    });

    if (existingCustomer) {
      return res.status(409).json({
        status: false,
        message: `Customer with the same contact number already exists for the cafe "${cafe}".`,
      });
    }

    let customerProfile;
    // Handle image uploads
    if (req.file) {
      customerProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const newCustomer = await Customer.create({
      cafe,
      name,
      email,
      contact_no,
      age,
      address,
      gender,
      customerProfile,
      country,
      state,
      city,
      creditEligibility,
      creditLimit,
      creditAmount
    });

    res.status(201).json({
      status: true,
      message: "Customer created successfully",
      data: newCustomer,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const customerLoginCtrl = async (req, res) => {
  try {
    const { name, contact_no, password } = req.body;

    // Find customer by name and contact_no
    const customer = await Customer.findOne({ name, contact_no });
    if (!customer) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, contact_no: customer.contact_no, cafe: customer.cafe, name: customer.name },
      process.env.CUSTOMER_SECRET_KEY || "customer_secret",
      { expiresIn: process.env.JWT_EXPIRY || "18h" }
    );

    // Set cookie
    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 18, // 18 hours
    });

    // Send minimal safe user data to frontend
    res.status(200).json({
      status: true,
      message: "Customer login successful",
      customer: {
        _id: customer._id,
        name: customer.name,
        contact_no: customer.contact_no,
        cafe: customer.cafe,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Customer login failed",
      error: err.message,
    });
  }
};

const customerSendOtpCtrl = async (req, res) => {
  try {
    let { contact_no } = req.body;
    if (!contact_no) return res.status(400).json({ status: false, message: "Contact number is required" });

    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SID) {
      return res.status(500).json({
        status: false,
        message: "SMS service is not configured. Please contact administrator.",
      });
    }

    // ✅ Ensure E.164 format
    if (!contact_no.startsWith("+91")) contact_no = `+91${contact_no}`;

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: contact_no,
        channel: "sms",
      });

    res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      // sid: verification.sid,
    });
  } catch (err) {
    console.error("Twilio OTP Error:", err);
    res.status(500).json({
      status: false,
      message: err.message || "Failed to send OTP. Please try again.",
    });
  }
};

const customerVerifyOtpCtrl = async (req, res) => {
  try {
    const { contact_no, otp } = req.body;

    if (!contact_no || !otp) {
      return res.status(400).json({
        status: false,
        message: "Mobile number and OTP required",
      });
    }

    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SID) {
      return res.status(500).json({
        status: false,
        message: "SMS service is not configured. Please contact administrator.",
      });
    }

    // ✅ Verify OTP with Twilio
    const verification_check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${contact_no}`,
        code: otp,
      });

    if (verification_check.status !== "approved") {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Find customer
    const customer = await Customer.findOne({ contact_no });
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "User not found. Please register first.",
      });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: customer._id,
        contact_no: customer.contact_no,
        cafe: customer.cafe,
        name: customer.name,
      },
      process.env.CUSTOMER_SECRET_KEY || "customer_secret",
      { expiresIn: process.env.JWT_EXPIRY || "18h" }
    );

    console.log("Generated Token:", token);

    // ✅ Set cookie
    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 18, // 18 hours
    });

    // ✅ Send the same structure as old password login
    res.status(200).json({
      status: true,
      message: "Customer login successful",
      token, // ✅ Include token here
      customer: {
        _id: customer._id,
        name: customer.name,
        contact_no: customer.contact_no,
        cafe: customer.cafe,
      },
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({
      status: false,
      message: err.message || "OTP verification failed. Please try again.",
    });
  }
};

const customerAuthCtrl = (req, res) => {
  const token = req.cookies.customer_token;
  if (!token) {
    return res.status(401).json({ status: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.CUSTOMER_SECRET_KEY || "customer_secret");
    return res.status(200).json({ status: true, customer: decoded });
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

const authMiddleware = (req, res) => {
  const token = req.cookies["customer_token"];
  if (!token) {
    return res.status(401).json({ status: false, message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.CUSTOMER_SECRET_KEY || "customer_secret"
    );
    res.json({
      status: true,
      customer: decoded,
    });
  } catch (err) {
    res.status(401).json({ status: false, message: "Invalid or expired token" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetOTP -otpExpires');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ status: true, message: "User fetched successfully", data: user });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to fetch user", error: err.message });
  }
};

const getStyxData = async (req, res) => {
  try {
    const user = await User.find().select('-password -resetOTP -otpExpires');

    res.status(200).json({ status: true, message: "User fetched successfully", data: user[0] });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to fetch user", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -resetOTP -otpExpires');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to update user", error: err.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("customer_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ status: true, message: "User logged out successfully" });
};

const resetSuperadminPassword = async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hash
    res.status(200).json({ status: true, message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to reset password", error: err.message });
  }
};

const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SUPERADMIN_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRY || "18h" }
    );

    res.status(200).json({
      status: true,
      message: "Authentication successful",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          createdAt: user.createdAt,
          role: user.role,
          cafe: user.cafe,
          billingAddress: user.billingAddress,
          shippingAddress: user.shippingAddress,
          country1: user.country1,
          country2: user.country2,
          state1: user.state1,
          state2: user.state2,
          city1: user.city1,
          city2: user.city2,
          pincode1: user.pincode1,
          pincode2: user.pincode2,
          latitude1: user.latitude1,
          latitude2: user.latitude2,
          longitude1: user.longitude1,
          longitude2: user.longitude2,
          gstIn: user.gstIn,
          pan: user.pan
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Authentication failed", error: err.message });
  }
};

const cafeLoginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cafe = await Cafe.findOne({ email }).select("+password").populate("location", "country state city address");
    if (!cafe) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, cafe.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: cafe._id, email: cafe.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRY || "18h" }
    );

    const { password: _, ...cafeData } = cafe.toObject();

    res.status(200).json({
      status: true,
      message: "Authentication successful",
      data: {
        token,
        cafe: {
          ...cafeData,
          role: "admin",
        },
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Authentication failed", error: err.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Email does not exist" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetOTP = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 mins
    await user.save();

    const mailSubject = "Password Reset OTP";
    const content = `
      <p>Hi ${user.name},</p>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendMail(email, mailSubject, content);

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error in forgetPassword:", err);
    return res.status(500).json({
      status: false,
      message: "Error processing forget password request",
      error: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      status: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select(
      "+resetOTP +otpExpires +password"
    );
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ status: false, message: "OTP expired or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOTP);
    if (!isOtpValid) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    user.password = newPassword;

    user.resetOTP = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      status: false,
      message: "Error processing password reset request",
      error: err.message,
    });
  }
};

const forgetCafePassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "Email is required" });
  }

  try {
    const user = await Cafe.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Email does not exist" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.resetOTP = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 mins
    await user.save();

    const mailSubject = "Password Reset OTP";
    const content = `
      <p>Hi ${user.name},</p>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendMail(email, mailSubject, content);

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error in forgetPassword:", err);
    return res.status(500).json({
      status: false,
      message: "Error processing forget password request",
      error: err.message,
    });
  }
};

const resetCafePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      status: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await Cafe.findOne({ email }).select(
      "+resetOTP +otpExpires +password"
    );
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ status: false, message: "OTP expired or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.resetOTP);
    if (!isOtpValid) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;

    user.resetOTP = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      status: false,
      message: "Error processing password reset request",
      error: err.message,
    });
  }
};

module.exports = {
  registerCtrl,
  customerRegisterCtrl,
  customerLoginCtrl,
  customerAuthCtrl,
  authMiddleware,
  getStyxData,
  loginCtrl,
  cafeLoginCtrl,
  forgetPassword,
  resetPassword,
  getUserById,
  updateUser,
  resetSuperadminPassword,
  forgetCafePassword,
  resetCafePassword,
  logoutUser,
  customerSendOtpCtrl,
  customerVerifyOtpCtrl
};