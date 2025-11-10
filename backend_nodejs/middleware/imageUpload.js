const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to dynamically determine the folder based on the route
const getUploadFolder = (req) => {
  console.log("Base URL:", req.baseUrl);
  const segments = req.baseUrl.split("/").filter(Boolean);
  const routePath = segments[1] || "default"; // fallback to "default" if undefined
  const uploadPath = path.join(__dirname, `../uploads/${routePath}`);

  console.log("Upload path determined:", uploadPath);

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating upload folder:", err);
    throw err;
  }

  return uploadPath;
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folder = getUploadFolder(req);
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and document files (JPEG, PNG, PDF, DOC, DOCX) are allowed."), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;