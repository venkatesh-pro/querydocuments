const User = require("../model/auth");
const TempUser = require("../model/tempUser");
const geoip = require("geoip-lite");
const jwt = require("jsonwebtoken");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.registerPhoneNumber = async (req, res) => {
  try {
    const { email } = req.user;
    const { phoneNumber, countryCode } = req.body;

    const user = await TempUser.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await client.messages.create({
      body: `Enter the otp: ${otp} to complete registration`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `${countryCode}${phoneNumber}`,
    });

    if (user) {
      user.phoneOtp = otp;
      user.save();
    } else {
      await TempUser.create({
        email,
        phoneOtp: otp,
        phoneNumber,
      });
    }

    res.status(200).send("opt success");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};
exports.verifyPhoneNumberOtp = async (req, res) => {
  try {
    const { name, picture, email, user_id } = req.user;

    const { phoneNumber, countryCode, phoneOtp } = req.body;

    const user = await TempUser.findOne({ email, phoneNumber });

    if (user) {
      if (phoneOtp === user.phoneOtp) {
        // create user

        const isAlredyUser = await User.findOne({ email });
        if (isAlredyUser) {
          return res.status(400).json({
            error: "User Alredy Created, Login To Continue",
          });
        }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: "1m",
        });
        console.log(token);
        const newUser = await User.create({
          email,
          name: name,
          picture,
          user_id,
          phoneNumber,
          countryCode,
          token: token,
        });

        await TempUser.deleteOne({ email, phoneNumber });

        res.status(200).json(newUser);
      } else {
        return res.status(400).json({
          error: "Wrong Otp",
        });
      }
    } else {
      return res.status(400).json({
        error: "Otp Expired ",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1m",
      });

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          token: token,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } else {
      res.status(400).json({
        error: "No User Found, Please Register First",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const authtoken = req.headers.authtoken;
    console.log("authtoken", authtoken);
    if (!authtoken) {
      console.log("authtoken(): Missing authtoken");
      return res.status(400);
    }

    const isUser = await User.findOne({ token: authtoken });
    if (!isUser) {
      console.log(`auth token not found; ${authtoken}`);
      return res.status(400);
    }
    const token = jwt.sign({ email: isUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    const updatedUser = await User.findOneAndUpdate(
      { email: isUser.email },
      {
        token: token,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};
exports.getCountry = async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    console.log(ip);
    const country = geoip.lookup(ip)?.country;

    if (country) {
      res.json(country);
    } else {
      res.json("UNKNOWN");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong.Please try again",
    });
  }
};
