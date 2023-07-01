const User = require("../model/auth");

exports.register = async (req, res) => {
  try {
    const { name, picture, email, user_id } = req.user;

    const user = await User.findOne({ email });
    if (user) {
      res.json(user);
    } else {
      const newUser = await User.create({
        email,
        name: name,
        picture,
        user_id,
      });
      res.json(newUser);
    }
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    res.json(user);
  } catch (error) {
    res.status(400).json({
      error: "No User Found",
    });
  }
};
