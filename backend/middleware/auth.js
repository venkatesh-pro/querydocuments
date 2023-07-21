const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/auth");

exports.authCheckFirebase = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (err) {
    console.log("err", err);
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};
exports.authCheck = async (req, res, next) => {
  try {
    const decoded = await promisify(jwt.verify)(
      req.headers.authtoken,
      process.env.JWT_SECRET
    );
    console.log(decoded);

    try {
      const user = await User.findOne({ email: decoded.email });
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
      return res.end();
    }
  } catch (err) {
    console.log("err", err);
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};
