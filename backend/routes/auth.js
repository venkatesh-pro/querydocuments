const express = require("express");
const {
  login,
  registerPhoneNumber,
  verifyPhoneNumberOtp,
  getCountry,
} = require("../controller/auth");
const { authCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/auth/registerphoneNumber", authCheck, registerPhoneNumber);
router.post("/auth/verifyphoneNumberOtp", authCheck, verifyPhoneNumberOtp);

router.post("/login", authCheck, login);

// getCountry
router.get("/paymentCheckoutpage", authCheck, getCountry);

module.exports = router;
