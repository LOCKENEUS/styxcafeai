const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Location = require('./model');

const createLocation = async (req, res) => {
  try {
    const { address, country, state, city, lat, long, details } = req.body;

    let locationImage
    if(req.file){
     locationImage = req.file.path.replace(/^.*[\\/](uploads[\\/])/, "uploads/").replace(/\\/g, "/");
    }

    const newLocation = await Location.create({
      address,
      country,
      state,
      city,
      lat,
      long,
      locationImage,
      details
    });

    res.status(201).json({
      status: true,
      message: 'Location created successfully',
      data: newLocation,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        status: false,
        message: 'Location not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Location fetched successfully',
      data: location,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const locationId = req.params.id;
    const updateData = { ...req.body };

    if (req.file) {
      // updateData.locationImage = req.file.path;
      updateData.locationImage = req.file.path.replace(/^.*[\\/](uploads[\\/])/, "uploads/").replace(/\\/g, "/");
    }

    const location = await Location.findByIdAndUpdate(
      locationId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!location) {
      return res.status(404).json({
        status: false,
        message: 'Location not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Location updated successfully',
      data: location,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { is_active: false, is_deleted: true },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({
        status: false,
        message: 'Location not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Location deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({is_active: true, is_deleted: false});

    res.status(200).json({
      status: true,
      message: 'Locations fetched successfully',
      results: locations.length,
      data: locations,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { createLocation, getLocation, updateLocation, deleteLocation, getLocations };