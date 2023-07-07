const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const fileQuerySchema = mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileId: {
      type: ObjectId,
      ref: "fileUpload",
      required: true,
      index: true,
    },

    // question and answer
    // chat: {
    //   type: ObjectId,
    //   ref: "Chat",
    // },

    message: {
      type: String,
      trim: true,
      required: true,
    },
    isHuman: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const fileQueryModal = mongoose.model("fileQuery", fileQuerySchema);

module.exports = fileQueryModal;
