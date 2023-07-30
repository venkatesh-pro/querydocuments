const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tokenSchema = mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: false,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      index: true,
    },
    // ip: { type: String },
    // isoCodeState: { type: String },
    // stateName: { type: String },
    // continent: { type: String },
    // isoCodeCountry: { type: String },
    // cityName: { type: String },
  },
  {
    timestamps: true,
  }
);

const tokenModal = mongoose.model("tokens", tokenSchema);

module.exports = tokenModal;
