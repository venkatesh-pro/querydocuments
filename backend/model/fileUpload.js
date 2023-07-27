const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const fileUploadSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      // required: true,
    },
    isLink: {
      type: Boolean,
      default: false,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const fileUploadModal = mongoose.model("fileUpload", fileUploadSchema);

module.exports = fileUploadModal;
