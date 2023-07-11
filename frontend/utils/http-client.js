/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import axios from "axios";
import jwt_decode from "jwt-decode";
import { firebaseAuth } from "../config/firebase";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  timeout: 100000,
  headers: {
    "Content-type": "application/json",
  },
});

//for adding auth to request header
api.interceptors.request.use(function (config) {
  const userAuthStr = localStorage.getItem("auth");
  // console.log(userAuthStr);
  if (userAuthStr) {
    const userAuth = JSON.parse(userAuthStr);
    console.log(userAuth);
    if (userAuth?.token) config.headers.authtoken = `${userAuth?.token}`;
  }
  return config;
});

//for handling auth
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    console.log("ERROR ...>>>>>>>>>>>>>>>>......>>>>>...", error);
    const prevRequest = error.config;
    if (error.response.status === 401 && !prevRequest.__isRetryRequest) {
      prevRequest.__isRetryRequest = true;
      // refresh token get

      try {
        const token = (await firebaseAuth.currentUser.getIdTokenResult(true))
          .token;
        console.log("currentUser", token);

        const userAuthStr = localStorage.getItem("auth");
        if (userAuthStr) {
          const userAuth = JSON.parse(userAuthStr);

          userAuth.token = token;

          localStorage.setItem("auth", JSON.stringify(userAuth));
          prevRequest.headers["authtoken"] = `${userAuth.token}`;
        }

        return axios(prevRequest);
      } catch (e) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
