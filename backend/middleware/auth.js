const admin = require("../config/firebase");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};
