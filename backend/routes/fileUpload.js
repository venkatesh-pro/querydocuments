const express = require("express");
const { uploadFile, sendMessage } = require("../controller/fileUpload.js");
const { authCheck } = require("../middleware/auth");
const fileUpload = require("express-fileupload");
const { validateFile } = require("../middleware/fileUpload.js");

const router = express.Router();

router.post("/uploadFile", authCheck, fileUpload(), validateFile, uploadFile);
router.post("/sendMessage", authCheck, sendMessage);

module.exports = router;
