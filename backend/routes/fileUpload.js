const express = require("express");
const { uploadFile, sendMessage, razorpayWebhook, webhook, cancelSubsciption, whichplan, subscribeRazorpay, subscribeStripe } = require("../controller/fileUpload.js");
const { authCheck } = require("../middleware/auth");
const fileUpload = require("express-fileupload");
const { validateFile } = require("../middleware/fileUpload.js");

const router = express.Router();

router.post("/uploadFile", authCheck, fileUpload(), validateFile, uploadFile);
router.post("/sendMessage", authCheck, sendMessage);

// payment gateway

router.post("/subscribe-stripe", authCheck, subscribeStripe);
router.post("/subscribe-razorpay", authCheck, subscribeRazorpay);

router.get("/whichplan", authCheck, whichplan);
// for cancel subscription
router.post("/cancelSubscribe", authCheck, cancelSubsciption);

// webhook
router.post("/stripe-webhook", webhook);
router.post("/razorpay-webhook", razorpayWebhook);

module.exports = router;
