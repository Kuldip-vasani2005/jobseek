import multer from "multer";

// Use memory storage (no local file saving)
const storage = multer.memoryStorage();

// Create the multer upload instance
const upload = multer({ storage });

// Export middleware for single file upload under the field name "file"
export const singleUpload = upload.single("file");
