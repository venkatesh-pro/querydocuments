import React, { useEffect, useState } from "react";
import { firebaseAuth, googleAuthProvider } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  registerPhoneNumberFunction,
  verifyPhoneOtpFunction,
} from "../../function/auth";

const index = () => {
  const [uiState, setUiState] = useState("registerGoogle");
  const [token, setToken] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("6385487401");
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
      const { data } = await registerPhoneNumberFunction(
        {
          countryCode,
          phoneNumber,
        },
        token
      );
      console.log(data);

      setUiState("verifyPhoneNumberOtp");
    } catch (error) {
      console.log(error);
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

      data.token = token;

      window.localStorage.setItem("auth", JSON.stringify(data));

      dispatch({
        type: "LOGIN",
        payload: {
          name: data.name,
          email: data.email,
          role: data.role,
          _id: data._id,
          token: token,
        },
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default index;
