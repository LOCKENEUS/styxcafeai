const ItemGroup = require("./model");
const Item = require("../item/model");

const createItemGroup = async (req, res) => {
  try {
    const {
      cafe,
      group_name,
      unit,
      items,
      description,
      taxable,
      tax,
      manufacturer,
      brand,
      superadmin
    } = req.body;

    // Validate required fields
    if (!group_name || !unit || !items || !Array.isArray(items)) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
      });
    }

    if(!manufacturer || manufacturer === "") {
      req.body.manufacturer = undefined;
    }

    if(!superadmin || superadmin === "") {
      req.body.superadmin = undefined;
    }
    
    // Create item group
    const newItemGroup = new ItemGroup({
      cafe,
      group_name,
      unit,
      taxable,
      tax,
      manufacturer: manufacturer || null,
      brand: brand || null,
      description,
    });

    // Save item group first to get the ID
    const savedItemGroup = await newItemGroup.save();

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
        groupId: savedItemGroup._id,
      });

      const savedItem = await newItem.save(); // Save item
      createdItemIds.push(savedItem._id); // Store the ID
    }

    // Update the item group with created item IDs
    savedItemGroup.items = createdItemIds;
    await savedItemGroup.save();

    return res.status(201).json({
      status: true,
      message: "Item group added successfully",
      data: savedItemGroup,
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

const getItemGroupList = async (req, res) => {
  try {
    // Fetch all item groups and populate related fields
    const itemGroups = await ItemGroup.find({ cafe: req.params.id })
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
      data: itemGroups,
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

const getItemGroupById = async (req, res) => {
  try {
    const { id } = req.params; // Extract item group ID from request params

    // Find item group by ID and populate related fields
    const itemGroup = await ItemGroup.findById(id)
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
    if (!itemGroup) {
      return res.status(404).json({
        status: false,
        message: "Item group not found",
      });
    }

    // Return the retrieved item group
    return res.status(200).json({
      status: true,
      message: "Item group retrieved successfully",
      data: itemGroup,
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

const updateItemGroup = async (req, res) => {
  try {
    const { id } = req.params; // Get item group ID from params
    const { cafe, group_name, unit, items, taxable, tax, manufacturer, brand } =
      req.body;

    if(!manufacturer || manufacturer === "") {
      req.body.manufacturer = undefined;
      req.body.brand = undefined;
    };

    // Validate required fields
    if (!group_name || !unit || !items || !Array.isArray(items)) {
      return res.status(400).json({
        status: false,
        message: "Required fields must be provided",
      });
    }

    // Find existing item group
    const existingItemGroup = await ItemGroup.findById(id);
    if (!existingItemGroup) {
      return res.status(404).json({
        status: false,
        message: "Item group not found",
      });
    }

    // Update item group fields
    existingItemGroup.cafe = cafe || existingItemGroup.cafe;
    existingItemGroup.group_name = group_name || existingItemGroup.group_name;
    existingItemGroup.unit = unit || existingItemGroup.unit;
    existingItemGroup.taxable =
      taxable !== undefined ? taxable : existingItemGroup.taxable;
    existingItemGroup.tax = tax || existingItemGroup.tax;
    existingItemGroup.manufacturer =
      manufacturer || existingItemGroup.manufacturer;
    existingItemGroup.brand = brand || existingItemGroup.brand;

    // Save updated item group
    const updatedItemGroup = await existingItemGroup.save();

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
    updatedItemGroup.items = updatedItemIds;
    await updatedItemGroup.save();

    const itemGroupData = await ItemGroup.findById(id)
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
      data: itemGroupData,
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

const deleteItemGrpup = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        is_active: false,
        is_deleted: true,
      },
      { new: true }
    );
    if (!deletedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

module.exports = {
  createItemGroup,
  updateItemGroup,
  getItemGroupList,
  getItemGroupById,
  updateItemGroup,
  deleteItemGrpup,
};
