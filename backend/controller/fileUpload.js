const User = require("../model/auth");

exports.uploadFile = async (req, res) => {
  try {
    const { email } = req.user;
    console.log(email);
    // const user = await User.findOne({ email });
    res.json(email);
  } catch (error) {
    res.status(400).json({
      error: "No User Found",
    });
  }
};
