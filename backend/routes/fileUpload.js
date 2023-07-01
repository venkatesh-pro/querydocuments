const express = require("express");
const { uploadFile } = require("../controller/fileUpload.js");
const { authCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/uploadFile", authCheck, uploadFile);

module.exports = router;
