const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateNotePayload = ({ title, content } = {}) => {
  if (typeof title !== "string" || typeof content !== "string") {
    return "Title and content are required.";
  }

  if (!title.trim() || !content.trim()) {
    return "Title and content cannot be empty.";
  }

  return null;
};

module.exports = {
  isValidObjectId,
  validateNotePayload,
};
