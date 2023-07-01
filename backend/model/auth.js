const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    user_id: {
      type: String,
      required: true,
    },
    role: {
      type: Array,
      default: "User",
    },
  },
  { timestamps: true }
);

const UserModal = mongoose.model("User", userSchema);

module.exports = UserModal;
