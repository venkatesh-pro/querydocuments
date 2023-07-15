const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tempUserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    countryCode: {
      type: String,
      required: true,
      default: "+91",
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    phoneOtp: String,
  },

  { timestamps: true }
);

const TempUserModel = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUserModel;
