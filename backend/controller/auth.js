const User = require("../model/auth");
const TempUser = require("../model/tempUser");
const Token = require("../model/token");
const geoip = require("geoip-lite");
const jwt = require("jsonwebtoken");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.registerPhoneNumber = async (req, res) => {
  try {
    const { email } = req.user;
    const { phoneNumber } = req.body;

    const isPhoneExist = await User.findOne({ phoneNumber });
    // if (isPhoneExist) {
    //   return res.status(400).json({
    //     error: "Phone Number Already Used",
    //   });
    // }

    const user = await TempUser.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await client.messages.create({
      body: `Enter the otp: ${otp} to complete registration`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `${phoneNumber}`,
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
            error: "You Already Used this Email, Login To Continue",
          });
        }

        await TempUser.deleteOne({ email, phoneNumber });

        const newAuthToken = jwt.sign(
          { email: email },
          process.env.JWT_AUTH_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        const newRefreshToken = jwt.sign(
          { email: email },
          process.env.JWT_REFRESH_TOKEN,
          {
            expiresIn: "7d",
          }
        );

        const newUser = await User.create({
          email,
          name: name,
          picture,
          user_id,
          phoneNumber,
          // token: newAuthToken,
          // refreshToken: newRefreshToken,
        });
        await Token.create({
          userId: newUser._id,
          token: newAuthToken,
          refreshToken: newRefreshToken,
        });
        res.status(200).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          picture: newUser.picture,
          token: newAuthToken,
          refreshToken: newRefreshToken,
        });
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
      const newAuthToken = jwt.sign(
        { email: email },
        process.env.JWT_AUTH_TOKEN,
        {
          expiresIn: "1h",
        }
      );
      const newRefreshToken = jwt.sign(
        { email: email },
        process.env.JWT_REFRESH_TOKEN,
        {
          expiresIn: "7d",
        }
      );

      // const updatedUser = await User.findOneAndUpdate(
      //   { email },
      //   {
      //     token: newAuthToken,
      //     refreshToken: newRefreshToken,
      //   },
      //   { new: true }
      // );

      await Token.create({
        userId: user._id,
        token: newAuthToken,
        refreshToken: newRefreshToken,
      });
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: newAuthToken,
        refreshToken: newRefreshToken,
      });
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
    const refreshToken = req.headers.rt;

    if (!refreshToken) {
      console.log("refreshToken(): Missing refresh token");
      return res.status(400).end();
    }

    const isToken = await Token.findOne({ refreshToken });
    if (!isToken) {
      console.log(`refresh token not found; ${refreshToken}`);
      return res.status(400).end();
    }

    const decoded = await jwt.verify(
      isToken.refreshToken,
      process.env.JWT_REFRESH_TOKEN
    );

    console.log(decoded);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.log(`User not found for refresh token; ${refreshToken}`);
      return res.status(400).end();
    }

    const newAuthToken = jwt.sign(
      { email: user.email },
      process.env.JWT_AUTH_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    // const updatedUser = await User.findOneAndUpdate(
    //   { email: isUser.email },
    //   {
    //     token: newAuthToken,
    //   },
    //   { new: true }
    // );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: newAuthToken,
      refreshToken: refreshToken,
    });
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
