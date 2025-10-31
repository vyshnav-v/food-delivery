/**
 * Message constants for consistent user feedback
 */

export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to load data",
  CREATE_FAILED: "Failed to create item",
  UPDATE_FAILED: "Failed to update item",
  DELETE_FAILED: "Failed to delete item",
  UPLOAD_FAILED: "Failed to upload file",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  VALIDATION_ERROR: "Please check your input",
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: "Created successfully!",
  UPDATED: "Updated successfully!",
  DELETED: "Deleted successfully!",
  UPLOADED: "Uploaded successfully!",
  SAVED: "Saved successfully!",
  COPIED: "Copied to clipboard!",
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email",
  INVALID_URL: "Please enter a valid URL",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  PASSWORD_MISMATCH: "Passwords do not match",
} as const;
