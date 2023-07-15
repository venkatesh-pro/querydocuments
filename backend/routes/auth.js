const express = require("express");
const {
  login,
  registerPhoneNumber,
  verifyPhoneNumberOtp,
} = require("../controller/auth");
const { authCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/auth/registerphoneNumber", authCheck, registerPhoneNumber);
router.post("/auth/verifyphoneNumberOtp", authCheck, verifyPhoneNumberOtp);

router.post("/login", authCheck, login);


module.exports = router;
