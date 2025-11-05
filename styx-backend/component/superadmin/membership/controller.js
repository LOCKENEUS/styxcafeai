const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Membership = require('./model');

const createMembership = async (req, res) => {
  try {
    let { cafe, name, details, validity, limit, price } = req.body;

    // Ensure details is always an array
    if (!Array.isArray(details)) {
      details = [details]; // Convert a single string into an array
    }

    const newMembership = await Membership.create({
      cafe,
      name,
      details,
      validity,
      limit,
      price
    });

    res.status(201).json({
      status: true,
      message: "Membership created successfully",
      data: newMembership,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        status: false,
        message: 'Membership not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Membership fetched successfully',
      data: membership,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    let { index, newDetail, ...updateData } = req.body; // Extract index and new detail separately

    let updateQuery = { ...updateData }; // Store other update fields

    // Handle specific details array update if index and newDetail are provided
    if (index !== undefined && newDetail !== undefined) {
      updateQuery[`details.${index}`] = newDetail; // Dynamically update the specific array index
    }

    const membership = await Membership.findByIdAndUpdate(membershipId, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!membership) {
      return res.status(404).json({
        status: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Membership updated successfully",
      data: membership,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!membership) {
      return res.status(404).json({
        status: false,
        message: 'Membership not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'membership marked as deleted.',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getMemberships = async (req, res) => {
  try {
    const id = req.params.id;
    const memberships = await Membership.find({is_active: true, is_deleted: false, cafe: id});

    res.status(200).json({
      status: true,
      message: 'Memberships fetched successfully',
      results: memberships.length,
      data: memberships,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { createMembership, getMembership, updateMembership, deleteMembership, getMemberships };