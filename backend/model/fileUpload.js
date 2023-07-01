const mongoose = require("mongoose");

const fileUploadSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    embeddingUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const fileUploadModal = mongoose.model("fileUpload", fileUploadSchema);

module.exports = fileUploadModal;
