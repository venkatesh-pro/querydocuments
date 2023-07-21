/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import axios from "axios";
import jwt_decode from "jwt-decode";
import { firebaseAuth } from "../config/firebase";
import { store } from "../pages/_app";

const logoutUser = () => ({
  type: "LOGOUT",
  payload: null,
});
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  timeout: 100000,
  headers: {
    // "Content-type": "application/json",
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
    if (error.response.status === 401) {
      console.log("removed from local storage");
      localStorage.removeItem("auth");
      // localStorage.removeItem("auth");
      store.dispatch(logoutUser());
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
