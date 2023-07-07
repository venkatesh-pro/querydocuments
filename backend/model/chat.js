// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema.Types;

// const chatSchema = mongoose.Schema(
//   {
//     senderId: {
//       type: ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     fileQueryId: {
//       type: ObjectId,
//       ref: "fileQuery",
//       required: true,
//       index: true,
//     },
//     message: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     isHuman: {
//       type: Boolean,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const chatModal = mongoose.model("chat", chatSchema);

// module.exports = chatModal;
