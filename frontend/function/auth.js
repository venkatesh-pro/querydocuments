import api from "../utils/http-client";

export const loginFunction = async (authtoken) => {
  return await api.post(
    `/login`,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const registerPhoneNumberFunction = async (authData, authtoken) => {
  return await api.post(
    `/auth/registerphoneNumber`,
    {
      phoneNumber: authData.phoneNumber,
      countryCode: authData.countryCode,
    },
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};
export const verifyPhoneOtpFunction = async (authData, authtoken) => {
  return await api.post(
    `/auth/verifyphoneNumberOtp`,
    {
      countryCode: authData.countryCode,
      phoneNumber: authData.phoneNumber,
      phoneOtp: authData.phoneOtp,
    },
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};
