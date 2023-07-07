const User = require("../model/auth");
const FileQuery = require("../model/fileQuery");
const FileUpload = require("../model/fileUpload");

exports.allUpload = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email }).select("_id");
    console.log(user);

    const allFileUpload = await FileUpload.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    res.json(allFileUpload);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Fetch Failed",
    });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { email } = req.user;
    const { fileUploadId } = req.params;

    const user = await User.findOne({ email }).select("_id");
    console.log(user);

    const allFileUpload = await FileQuery.find({
      userId: user._id,
      fileId: fileUploadId,
    });

    res.json(allFileUpload);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Fetch Failed",
    });
  }
};
