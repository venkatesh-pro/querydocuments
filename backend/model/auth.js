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
    token: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    // didn't added the feature, i need to save by ip address
    country: {
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
    // if i change the plan to free while cancel subscription we face one problem that is in upload or query, if exipiry data is not expired, we are checking only pro plan or basic, we are not checking free, because, if user cancelled inbetween the expiry, they paid money, so they need to use the paid plan until the expiry, so i am going to create another plan property for ui display in react that is planForUI
    plan: {
      type: String,
      default: "free",
      required: true,
      enum: ["free", "basic", "pro"],
    },

    // planForUI only change for cancel sub, not plan, it will take care by webhook
    planForUI: {
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
