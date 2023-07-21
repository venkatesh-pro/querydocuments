const express = require("express");
const {
  login,
  registerPhoneNumber,
  verifyPhoneNumberOtp,
  getCountry,
} = require("../controller/auth");
const { authCheckFirebase, authCheck } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/auth/registerphoneNumber",
  authCheckFirebase,
  registerPhoneNumber
);
router.post(
  "/auth/verifyphoneNumberOtp",
  authCheckFirebase,
  verifyPhoneNumberOtp
);

// i user authCheckFirebase to get the email from the token of firebase
router.post("/login", authCheckFirebase, login);

// getCountry
router.get("/paymentCheckoutpage", authCheck, getCountry);

module.exports = router;
