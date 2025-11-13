const HeroContent = require("../../../models/heroContent");
const ServiceContent = require("../../../models/serviceContent");
const { emitToCustomers, EVENTS } = require("../../../socket/socketManager");

// ============= HERO CONTENT =============

// Create Hero Content
exports.createHeroContent = async (req, res) => {
  try {
    const { title, subtitle, description, buttonText, buttonLink, order } = req.body;

    let backgroundImage = "";
    if (req.file) {
      backgroundImage = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const heroContent = await HeroContent.create({
      title,
      subtitle,
      description,
      backgroundImage,
      buttonText,
      buttonLink,
      order: order || 0,
    });

    // Emit real-time update
    emitToCustomers(EVENTS.HERO_UPDATED, heroContent);

    return res.status(201).json({
      status: true,
      message: "Hero content created successfully",
      data: heroContent,
    });
  } catch (error) {
    console.error("Error creating hero content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to create hero content",
    });
  }
};

// Get All Hero Content
exports.getAllHeroContent = async (req, res) => {
  try {
    const heroContent = await HeroContent.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Hero content fetched successfully",
      data: heroContent,
    });
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch hero content",
    });
  }
};

// Get Active Hero Content (for customer website)
exports.getActiveHeroContent = async (req, res) => {
  try {
    const heroContent = await HeroContent.find({ isActive: true }).sort({ order: 1 });

    return res.status(200).json({
      status: true,
      message: "Active hero content fetched successfully",
      data: heroContent,
    });
  } catch (error) {
    console.error("Error fetching active hero content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch active hero content",
    });
  }
};

// Update Hero Content
exports.updateHeroContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.backgroundImage = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const heroContent = await HeroContent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!heroContent) {
      return res.status(404).json({
        status: false,
        message: "Hero content not found",
      });
    }

    // Emit real-time update
    emitToCustomers(EVENTS.HERO_UPDATED, heroContent);

    return res.status(200).json({
      status: true,
      message: "Hero content updated successfully",
      data: heroContent,
    });
  } catch (error) {
    console.error("Error updating hero content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to update hero content",
    });
  }
};

// Delete Hero Content
exports.deleteHeroContent = async (req, res) => {
  try {
    const { id } = req.params;

    const heroContent = await HeroContent.findByIdAndDelete(id);

    if (!heroContent) {
      return res.status(404).json({
        status: false,
        message: "Hero content not found",
      });
    }

    // Emit real-time update
    emitToCustomers(EVENTS.HERO_UPDATED, { deleted: id });

    return res.status(200).json({
      status: true,
      message: "Hero content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hero content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to delete hero content",
    });
  }
};

// ============= SERVICE CONTENT =============

// Create Service Content
exports.createServiceContent = async (req, res) => {
  try {
    const { name, description, icon, order, featured } = req.body;

    let image = "";
    if (req.file) {
      image = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const serviceContent = await ServiceContent.create({
      name,
      description,
      icon,
      image,
      order: order || 0,
      featured: featured || false,
    });

    // Emit real-time update
    emitToCustomers(EVENTS.CONTENT_UPDATED, { type: "service", data: serviceContent });

    return res.status(201).json({
      status: true,
      message: "Service content created successfully",
      data: serviceContent,
    });
  } catch (error) {
    console.error("Error creating service content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to create service content",
    });
  }
};

// Get All Service Content
exports.getAllServiceContent = async (req, res) => {
  try {
    const serviceContent = await ServiceContent.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Service content fetched successfully",
      data: serviceContent,
    });
  } catch (error) {
    console.error("Error fetching service content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch service content",
    });
  }
};

// Get Active Service Content (for customer website)
exports.getActiveServiceContent = async (req, res) => {
  try {
    const serviceContent = await ServiceContent.find({ isActive: true }).sort({ order: 1 });

    return res.status(200).json({
      status: true,
      message: "Active service content fetched successfully",
      data: serviceContent,
    });
  } catch (error) {
    console.error("Error fetching active service content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch active service content",
    });
  }
};

// Update Service Content
exports.updateServiceContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.path
        .replace(/^.*[\\/](uploads[\\/])/, "uploads/")
        .replace(/\\/g, "/");
    }

    const serviceContent = await ServiceContent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!serviceContent) {
      return res.status(404).json({
        status: false,
        message: "Service content not found",
      });
    }

    // Emit real-time update
    emitToCustomers(EVENTS.CONTENT_UPDATED, { type: "service", data: serviceContent });

    return res.status(200).json({
      status: true,
      message: "Service content updated successfully",
      data: serviceContent,
    });
  } catch (error) {
    console.error("Error updating service content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to update service content",
    });
  }
};

// Delete Service Content
exports.deleteServiceContent = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceContent = await ServiceContent.findByIdAndDelete(id);

    if (!serviceContent) {
      return res.status(404).json({
        status: false,
        message: "Service content not found",
      });
    }

    // Emit real-time update
    emitToCustomers(EVENTS.CONTENT_UPDATED, { type: "service", deleted: id });

    return res.status(200).json({
      status: true,
      message: "Service content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service content:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to delete service content",
    });
  }
};
