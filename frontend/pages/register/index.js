import React, { useEffect, useState } from "react";
import { firebaseAuth, googleAuthProvider } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  registerPhoneNumberFunction,
  verifyPhoneOtpFunction,
} from "../../function/auth";
import { Box, Tab, Tabs } from "@mui/material";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-hot-toast";

const index = () => {
  const [uiState, setUiState] = useState("registerGoogle");
  const [token, setToken] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await firebaseAuth.signInWithPopup(googleAuthProvider);

      const { user } = res;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log(idTokenResult);
        setToken(idTokenResult.token);
        setUiState("registerPhoneNumber");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneNumber = async () => {
    try {
      console.log(phoneNumber);

      const isValid = isValidPhoneNumber(phoneNumber);

      if (isValid) {
        const { data } = await registerPhoneNumberFunction(
          {
            phoneNumber,
          },
          token
        );
        console.log(data);

        setUiState("verifyPhoneNumberOtp");
      } else {
        console.log("invalid");
        toast.error("Invalid PhoneNumber");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        (error.response.data.error === "Invalid or expired token"
          ? "Again Register From Google, Token Expired"
          : error.response.data.error) || error.message
      );
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const { data } = await verifyPhoneOtpFunction(
        {
          countryCode,
          phoneNumber,
          phoneOtp,
        },
        token
      );

      window.localStorage.setItem("auth", JSON.stringify(data));

      dispatch({
        type: "LOGIN",
        payload: {
          name: data.name,
          email: data.email,
          role: data.role,
          _id: data._id,
          token: data.token,
          picture: data.picture,
        },
      });
      router.push("/");

      toast.success("Register Success");
    } catch (error) {
      console.log(error);

      toast.error(
        (error.response.data.error === "Invalid or expired token"
          ? "Again Register From Google, Token Expired"
          : error.response.data.error) || error.message
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col h-[72vh]">
        <div className="mt-10">
          {uiState === "registerGoogle" && (
            <>
              <div className="flex items-center flex-col">
                <div className="flex items-center flex-col">
                  <h2 className="text-lg sm:text-2xl mt-3">Start Using Free</h2>
                  <h3 className="text-sm sm:text-xl mt-3">Free Forever</h3>
                  <h3 className="text-sm sm:text-xl mt-3">
                    No credit card required.
                  </h3>
                </div>

                <button
                  onClick={handleSignIn}
                  className="flex border-4 mt-3 p-2 items-center "
                >
                  <img
                    src="/googleicon.png"
                    alt="google icon"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="ml-2">Register with Google</span>
                </button>
              </div>
            </>
          )}

          {uiState === "registerPhoneNumber" && (
            <div className="flex items-center flex-col">
              <div className="flex items-center flex-col">
                <h2 className="text-lg sm:text-2xl">
                  Please Enter Phone Number
                </h2>
              </div>
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                className="p-2 bg-[#e1d0b3] mt-4"
                onChange={setPhoneNumber}
              />
              <button
                onClick={handlePhoneNumber}
                className="p-2 rounded-lg mt-2 bg-[#e1d0b3]"
              >
                submit
              </button>
            </div>
          )}

          {uiState === "verifyPhoneNumberOtp" && (
            <>
              <div className="flex items-center flex-col">
                <div className="flex items-center flex-col">
                  <h2 className="text-lg sm:text-2xl">Please Enter The Otp</h2>
                </div>
                <input
                  type="number"
                  name=""
                  id=""
                  value={phoneOtp}
                  className="pt-[3px] pb-[3px] w-full mt-4 border-2"
                  onChange={(e) => setPhoneOtp(e.target.value)}
                />
                <button
                  onClick={handleVerifyOtp}
                  className="p-2 rounded-lg mt-4 bg-[#e1d0b3]"
                >
                  submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default index;

/*

   {uiState === "registerGoogle" && (
        <button className="border-2" onClick={handleSignIn}>
          Register
        </button>
      )}
      {uiState === "registerPhoneNumber" && (
        <>
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          />
          <input
            type="number"
            name=""
            id=""
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={handlePhoneNumber}>submit</button>
        </>
      )}
      {uiState === "verifyPhoneNumberOtp" && (
        <>
          <input
            type="number"
            name=""
            id=""
            value={phoneOtp}
            onChange={(e) => setPhoneOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>submit</button>
        </>
      )}

*/
