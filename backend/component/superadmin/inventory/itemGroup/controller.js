const SaItemGroup = require("./model");
const Item = require("../../../admin/inventory/item/model");
const ItemGroup = require("../../../admin/inventory/itemGroup/model");

const createSaItemGroup = async (req, res) => {
  try {
    const {
      group_name,
      unit,
      items,
      description,
      taxable,
      tax,
      manufacturer,
      brand,
      cafe,
    } = req.body;

    // Validate required fields
    if (!group_name || !unit || !items || !Array.isArray(items)) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
      });
    }

    if (!manufacturer || manufacturer === "") {
      req.body.manufacturer = undefined;
    }

    if (!cafe || cafe === "") {
      req.body.cafe = undefined;
    }

    // Create item group
    const newSaItemGroup = new ItemGroup({
      group_name,
      unit,
      taxable,
      tax,
      manufacturer: manufacturer || null,
      brand: brand || null,
      description,
      user_type: "superadmin",
      cafe: null,
      superadmin: req.saId,
    });

    // Save item group first to get the ID
    const savedSaItemGroup = await newSaItemGroup.save();

    // Array to store created item IDs
    const createdItemIds = [];

    // Create and save items
    for (const item of items) {
      const newItem = new Item({
        ...item,
        unit,
        taxable,
        tax,
        manufacturer: manufacturer || null,
        brand: brand || null,
        groupId: savedSaItemGroup._id,
      });

      const savedItem = await newItem.save(); // Save item
      createdItemIds.push(savedItem._id); // Store the ID
    }

    // Update the item group with created item IDs
    savedSaItemGroup.items = createdItemIds;
    await savedSaItemGroup.save();

    return res.status(201).json({
      status: true,
      message: "Item group added successfully",
      data: savedSaItemGroup,
    });
  } catch (err) {
    console.error("Error adding item group:", err.stack);
    return res.status(500).json({
      status: false,
      message: "Error creating item group",
      error: err.message,
    });
  }
};

const getSaItemGroupList = async (req, res) => {
  try {
    // Fetch all item groups and populate related fields
    const SaItemGroups = await ItemGroup.find()
      .populate("manufacturer", "name")
      .populate("brand", "name")
      .populate("tax", "tax")
      .populate({
        path: "items",
        populate: [
          { path: "manufacturer", select: "name" },
          { path: "brand", select: "name" },
        ],
      }); // Populate item details along with nested references

    return res.status(200).json({
      status: true,
      message: "Item groups retrieved successfully",
      data: SaItemGroups,
    });
  } catch (err) {
    console.error("Error fetching item groups:", err.stack);
    return res.status(500).json({
      status: false,
      message: "Error retrieving item groups",
      error: err.message,
    });
  }
};

const getSaItemGroupById = async (req, res) => {
  try {
    const { id } = req.params; // Extract item group ID from request params

    // Find item group by ID and populate related fields
    const saItemGroup = await ItemGroup.findById(id)
      .populate("manufacturer", "name")
      .populate("brand", "name")
      .populate("tax", "tax_name, tax_rate")
      .populate({
        path: "items",
        populate: [
          { path: "manufacturer", select: "name" },
          { path: "brand", select: "name" },
          { path: "tax", select: "tax_name, tax_rate" },
        ],
      });

    // If no item group is found, return an error response
    if (!saItemGroup) {
      return res.status(404).json({
        status: false,
        message: "Item group not found",
      });
    }

    // Return the retrieved item group
    return res.status(200).json({
      status: true,
      message: "Item group retrieved successfully",
      data: saItemGroup,
    });
  } catch (err) {
    console.error("Error fetching item group:", err.stack);
    return res.status(500).json({
      status: false,
      message: "Error retrieving item group",
      error: err.message,
    });
  }
};

const updateSaItemGroup = async (req, res) => {
  try {
    const { id } = req.params; // Get item group ID from params
    const { group_name, unit, items, taxable, tax, manufacturer, brand } =
      req.body;

    if (!manufacturer || manufacturer === "") {
      req.body.manufacturer = undefined;
      req.body.brand = undefined;
    }

    // Validate required fields
    if (!group_name || !unit || !items || !Array.isArray(items)) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
      });
    }

    // Find existing item group
    const existingSaItemGroup = await ItemGroup.findById(id);
    if (!existingSaItemGroup) {
      return res.status(404).json({
        status: false,
        message: "Item group not found",
      });
    }

    // Update item group fields
    existingSaItemGroup.group_name =
      group_name || existingSaItemGroup.group_name;
    existingSaItemGroup.unit = unit || existingSaItemGroup.unit;
    existingSaItemGroup.taxable =
      taxable !== undefined ? taxable : existingSaItemGroup.taxable;
    existingSaItemGroup.tax = tax || existingSaItemGroup.tax;
    existingSaItemGroup.manufacturer =
      manufacturer || existingSaItemGroup.manufacturer;
    existingSaItemGroup.brand = brand || existingSaItemGroup.brand;

    // Save updated item group
    const updatedSaItemGroup = await existingSaItemGroup.save();

    // Store updated item IDs
    const updatedItemIds = [];

    // Update existing items and add new ones
    for (const item of items) {
      if (item._id) {
        // Update existing item
        const updatedItem = await Item.findByIdAndUpdate(item._id, item, {
          new: true,
        });
        if (updatedItem) {
          updatedItemIds.push(updatedItem._id);
        }
      }
    }

    // Update the item group with new item list
    updatedSaItemGroup.items = updatedItemIds;
    await updatedSaItemGroup.save();

    const SaItemGroupData = await SaItemGroup.findById(id)
      .populate("manufacturer", "name")
      .populate("brand", "name")
      .populate("tax", "tax_name, tax_rate")
      .populate({
        path: "items",
        populate: [
          { path: "manufacturer", select: "name" },
          { path: "brand", select: "name" },
          { path: "tax", select: "tax_name, tax_rate" },
        ],
      });

    return res.status(200).json({
      status: true,
      message: "Item group updated successfully",
      data: SaItemGroupData,
    });
  } catch (err) {
    console.error("Error updating item group:", err.stack);
    return res.status(500).json({
      status: false,
      message: "Error updating item group",
      error: err.message,
    });
  }
};


module.exports = {
  createSaItemGroup,
  getSaItemGroupList,
  getSaItemGroupById,
  updateSaItemGroup,
};
