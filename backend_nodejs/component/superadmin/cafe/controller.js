const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cafe = require("./model");
const sendMail = require("../../../utils/sendMail");

const createCafe = async (req, res) => {
  try {
    const {
      name,
      email,
      contact_no,
      cafe_name,
      location,
      address,
      website_url,
      password,
      gstNo,
      panNo,
      ownershipType,
      depositAmount,
      yearsOfContract,
      officeContactNo,
      description,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Password is required",
      });
    }

    const existingCafe = await Cafe.findOne({ email });
    if (existingCafe) {
      return res.status(400).json({
        status: false,
        message: "Cafe with this email already exists",
      });    
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let cafeLogo = "";
    if (req.files["cafeLogo"] && req.files["cafeLogo"].length > 0) {
      const file = req.files["cafeLogo"][0];
      cafeLogo = file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    let cafeImage = [];
    if (req.files["cafeImage"] && req.files["cafeImage"].length > 0) {
      cafeImage = req.files["cafeImage"].map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    let document = [];
    if (req.files["document"] && req.files["document"].length > 0) {
      document = req.files["document"].map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    const newCafe = await Cafe.create({
      name,
      email,
      contact_no,
      cafe_name,
      location,
      address,
      website_url,
      cafeImage,
      password: hashedPassword,
      gstNo,
      panNo,
      ownershipType,
      depositAmount,
      yearsOfContract,
      document,
      officeContactNo,
      description,
      cafeLogo,
    });

    // Send login credentials via email
    const mailSubject = "Cafe Account Created - Login Credentials";
    const mailContent = `
          <h2>Welcome to Our Cafe Management System</h2>
          <p>Dear ${name},</p>
          <p>Your cafe account has been created successfully.</p>
          <p><strong>Login Credentials:</strong></p>
          <p>Email: <strong>${email}</strong></p>
          <p>Password: <strong>${password}</strong></p>
          <p>Please login and change your password for security reasons.</p>
          <br/>
          <p>Best Regards,</p>
          <p>Your Company Name</p>
        `;

    await sendMail(email, mailSubject, mailContent);

    res.status(201).json({
      status: true,
      message: "Cafe created successfully",
      data: newCafe,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find({
      is_active: true,
      is_deleted: false,
    }).populate("location");

    res.status(200).json({
      status: true,
      message: "Cafes fetched successfully",
      count: cafes.length,
      data: cafes,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getCafeById = async (req, res) => {
  try {
    const { id } = req.params;

    const cafe = await Cafe.findById(id).populate("location");

    if (!cafe) {
      return res.status(404).json({
        status: false,
        message: "Cafe not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Cafe fetched successfully",
      data: cafe,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const updateCafe = async (req, res) => {
  try {

    const cafeId = req.params.id;
    const updateData = { ...req.body };
    delete updateData.email;

    const existingCafe = await Cafe.findById(cafeId);
    if (!existingCafe) {
      return res.status(404).json({ status: false, message: "Cafe not found" });
    }

    if (updateData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
      updateData.password = hashedPassword;
    }

    if (
      req.files &&
      req.files["cafeLogo"] &&
      req.files["cafeLogo"].length > 0
    ) {
      const file = req.files["cafeLogo"][0];
      updateData.cafeLogo = file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    let newImages = [];

    if (
      req.files &&
      req.files["cafeImage"] &&
      req.files["cafeImage"].length > 0
    ) {
      // newImages = req.files.map((file) =>
      //   file.path
      //     .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
      //     .replace(/\\/g, "/")
      // );

      newImages = req.files["cafeImage"].map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    if (newImages.length > 0) {
      if (typeof updateData.cafeImage === "string") {
        updateData.cafeImage = [updateData.cafeImage];
      }
      // If cafeImage is not an array (e.g., undefined or null), initialize it as an empty array
      else if (!Array.isArray(updateData.cafeImage)) {
        updateData.cafeImage = [];
      }
      updateData.cafeImage = [...updateData.cafeImage, ...newImages];
    }

    // Handle document uploads
    let newDocuments = [];
    if (
      req.files &&
      req.files["document"] &&
      req.files["document"].length > 0
    ) {
      newDocuments = req.files["document"].map((file) =>
        file.path
          .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
          .replace(/\\/g, "/")
      );
    }

    if (newDocuments.length > 0) {
      if (typeof updateData.document === "string") {
        updateData.document = [updateData.document];
      } else if (!Array.isArray(updateData.document)) {
        updateData.document = [];
      }
      updateData.document = [...updateData.document, ...newDocuments];
    }

    Object.assign(existingCafe, updateData);
    const updatedCafe = await existingCafe.save();

    const updatedCafeWithLocation = await updatedCafe.populate("location");

    res.status(200).json({
      status: true,
      message: "Cafe updated successfully",
      data: updatedCafeWithLocation,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message || "Internal server error",
    });
  }
};

const deleteCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!cafe) {
      return res.status(404).json({
        status: false,
        message: "Cafe not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Cafe marked as deleted",
      data: cafe,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Email and new password are required",
      });
    }

    const cafe = await Cafe.findOne({ email });
    if (!cafe) {
      return res.status(404).json({
        status: false,
        message: "Cafe not found with this email",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    cafe.password = hashedPassword;
    await cafe.save();

    res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createCafe,
  getCafeById,
  updateCafe,
  getAllCafes,
  deleteCafe,
  resetPassword,
};