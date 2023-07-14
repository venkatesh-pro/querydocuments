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
    stripeCustomerId: {
      type: String,
    },
    razorpayCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    razorpaySubscriptionId: {
      type: String,
    },
    isStripe: {
      type: Boolean,
    },
    isRazorpay: {
      type: Boolean,
    },
    plan: {
      type: String,
      default: "free",
      required: true,
      enum: ["free", "basic", "pro"],
    },

    freePlanUsageData: {
      totalFileUsed: {
        type: Number,
        default: 0,
      },
      totalQuestionsAsked: {
        type: Number,
        default: 0,
      },
      todayDate: {
        type: Number,
        required: true,
        default: () => new Date().getDate(),
      },
    },
    paidPlanUsageData: {
      totalFileUsed: {
        type: Number,
        required: true,
        default: 0,
      },
      totalQuestionsAsked: {
        type: Number,
        required: true,
        default: 0,
      },
      todayDate: {
        type: Number,
        required: true,
        default: () => new Date().getDate(),
      },
      expiry: {
        type: Number,
        // required: true,
      },
    },
  },
  { timestamps: true }
);

const UserModal = mongoose.model("User", userSchema);

module.exports = UserModal;
