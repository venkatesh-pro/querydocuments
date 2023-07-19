exports.validateFile = async (req, res, next) => {
  try {
    // console.log(req.files);
    const mimetype = req.files.file.mimetype;

    if (
      mimetype === "application/pdf" ||
      mimetype === "application/vnd.ms-powerpoint" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      mimetype === "application/msword" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/epub+zip"
    ) {
      next();
    } else {
      res.status(400).json({
        error: "We are currently Not accepting this file format",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "No File Found",
    });
  }
};
