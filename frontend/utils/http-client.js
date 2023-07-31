/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import axios from "axios";
import { store } from "../pages/_app";
import { toast } from "react-hot-toast";

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
    const prevRequest = error.config;
    if (error.response.status === 401) {
      prevRequest.__isRetryRequest = true;
      // refresh token get

      try {
        const userAuthStr = localStorage.getItem("auth");
        if (userAuthStr) {
          const userAuth = JSON.parse(userAuthStr);
          if (!userAuth?.refreshToken) {
            return authRejectPromise(error);
          }
          let data;
          try {
            // before doing refreshtoken request,
            console.log("before doing refreshtoken request", userAuth);
            console.log(
              "before doing refreshtoken request",
              userAuth.refreshToken
            );
            const tokenResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rt`,
              {
                headers: {
                  rt: userAuth.refreshToken,
                },
              }
            );
            data = tokenResponse.data;
          } catch (error) {
            // no toast, no message is necessary
            // return Promise.reject(error);
            return authRejectPromise(error);
          }

          const authLocalStr = localStorage.getItem("auth");
          if (authLocalStr) {
            const authLocal = JSON.parse(authLocalStr);
            authLocal.token = data.token;
            authLocal.refreshToken = data?.refreshToken;

            if (localStorage.getItem("auth")) {
              localStorage.setItem("auth", JSON.stringify(authLocal));
            }
            prevRequest.headers["authtoken"] = `${authLocal.token}`;

            try {
              return axios(prevRequest);
            } catch (e) {
              // internet connection failure
              console.log(e);
              return Promise.reject(error);
            }
          } else {
            return authRejectPromise(error);
          }
        } else {
          return authRejectPromise(error);
        }
        return;
        // const token = (await firebaseAuth.currentUser.getIdTokenResult(true))
        //   .token;
        // console.log("currentUser", token);

        // const userAuthStr = localStorage.getItem("auth");
        // if (userAuthStr) {
        //   const userAuth = JSON.parse(userAuthStr);

        //   userAuth.token = token;

        //   localStorage.setItem("auth", JSON.stringify(userAuth));
        //   prevRequest.headers["authtoken"] = `${userAuth.token}`;
        // }

        // return axios(prevRequest);
      } catch (e) {
        console.log("error in catch", e);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);
function authRejectPromise(error) {
  localStorage.removeItem("auth");
  toast.error("Please login");
  store.dispatch({
    type: "LOGOUT",
    payload: null,
  });

  return Promise.reject(error);
}
export default api;
