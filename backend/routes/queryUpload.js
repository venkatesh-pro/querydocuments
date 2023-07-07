const express = require("express");
const { authCheck } = require("../middleware/auth");
const { allUpload, fetchMessages } = require("../controller/queryUpload.js");

const router = express.Router();

router.get("/allUpload", authCheck, allUpload);
router.get("/fetchMessages/:fileUploadId", authCheck, fetchMessages);

module.exports = router;
