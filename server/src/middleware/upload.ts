import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const defaultMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const defaultExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
];

const parseAllowedTypes = () => {
  const raw = process.env.ALLOWED_FILE_TYPES;
  if (!raw) {
    return {
      mimeTypes: new Set(defaultMimeTypes),
      extensions: new Set(defaultExtensions),
    };
  }

  const items = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (items.length === 0) {
    return {
      mimeTypes: new Set(defaultMimeTypes),
      extensions: new Set(defaultExtensions),
    };
  }

  const mimeTypes = new Set<string>();
  const extensions = new Set<string>();

  items.forEach((item) => {
    if (item.includes("/")) {
      mimeTypes.add(item);
    } else {
      extensions.add(item.startsWith(".") ? item : `.${item}`);
    }
  });

  return { mimeTypes, extensions };
};

const allowedTypes = parseAllowedTypes();

// File filter
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  const extensionAllowed =
    allowedTypes.extensions.size === 0 ||
    allowedTypes.extensions.has(fileExtension);

  const mimeAllowed =
    allowedTypes.mimeTypes.size === 0 || allowedTypes.mimeTypes.has(mimeType);

  if (extensionAllowed && mimeAllowed) {
    return cb(null, true);
  }

  cb(new Error("File type is not allowed"));
};

// Multer config
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB default
  },
  fileFilter: fileFilter,
});
