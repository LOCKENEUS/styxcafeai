const Table = require("./model");
const { formatTimestamps } = require("../../../utils/utils");

const createTable = async (req, res) => {
  try {
    const { game_id, size, availability } = req.body;

    const newTable = await Table.create({
      game_id,
      size,
      availability
    });

    res.status(201).json({
      status: true,
      message: "Table created successfully",
      data: newTable,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getTableDetails = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        status: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Table fetched successfully",
      data: table,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const updateTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const updateData = { ...req.body };

    const table = await Table.findByIdAndUpdate(tableId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({
        status: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Table updated successfully",
      data: table,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({
        status: false,
        message: 'Table not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Table deleted successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

const getTables = async (req, res) => {
  try {
    const tables = await Table.find();

    res.status(200).json({
      status: true,
      message: 'Tables fetched successfully',
      results: tables.length,
      data: tables,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

module.exports = { createTable, getTableDetails, updateTable, deleteTable, getTables };
