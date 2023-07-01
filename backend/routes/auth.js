const express = require("express");
const { register, currentUser } = require("../controller/auth");
const { authCheck } = require("../middleware/auth");

const router = express.Router();

router.post("/auth", authCheck, register);
router.get("/current-user", authCheck, currentUser);

module.exports = router;
