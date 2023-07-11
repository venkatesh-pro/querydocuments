import api from "../utils/http-client";

export const getAllUploadsFunction = async (authtoken) => {
  return await api.get(`/allUpload`, {
    headers: {
      authtoken: authtoken,
    },
  });
};

export const sendMessageFunction = async (authtoken, data) => {
  return await api.post(`/sendMessage`, data, {
    headers: {
      authtoken: authtoken,
    },
  });
};
export const fetchMessageFunction = async (authtoken, fileUploadId) => {
  return await api.get(`/fetchMessages/${fileUploadId}`, {
    headers: {
      authtoken: authtoken,
    },
  });
};
