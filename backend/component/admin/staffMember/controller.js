const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StaffMember = require("./model");

const createStaffMember = async (req, res) => {
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
      department,
      role,
    } = req.body;

    let userProfile;
    // Handle image uploads
    if (req.file) {
      userProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const newStaffMember = await StaffMember.create({
      cafe,
      name,
      email,
      contact_no,
      age,
      address,
      gender,
      userProfile,
      country,
      state,
      city,
      department,
      role,
    });

    res.status(201).json({
      status: true,
      message: "Staff member created successfully",
      data: newStaffMember,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getAllStaffMembers = async (req, res) => {
  try {
    const staff = await StaffMember.find({
      is_active: true,
      is_deleted: false,
      cafe: req.params.id,
    });

    res.status(200).json({
      status: true,
      message: "Staff members fetched successfully",
      count: staff.length,
      data: staff,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const getStaffMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await StaffMember.findById(id);

    if (!staff) {
      return res.status(404).json({
        status: false,
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Staff member fetched successfully",
      data: staff,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

const updateStaffMember = async (req, res) => {
  try {
    const staffId = req.params.id;
    const updateData = { ...req.body };

    delete updateData.email;

    if (req.file) {
      updateData.userProfile = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const staff = await StaffMember.findByIdAndUpdate(staffId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(404).json({
        status: false,
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Staff member updated successfully",
      data: staff,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteStaffMember = async (req, res) => {
  try {
    const staff = await StaffMember.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        status: false,
        message: "Staff member not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Staff member marked as deleted",
      data: staff,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  createStaffMember,
  getAllStaffMembers,
  getStaffMemberById,
  updateStaffMember,
  deleteStaffMember,
};
