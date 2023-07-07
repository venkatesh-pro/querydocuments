import axios from "axios";

export const getAllUploadsFunction = async (authtoken) => {
  return await axios.get(`http://localhost:5000/api/allUpload`, {
    headers: {
      authtoken: authtoken,
    },
  });
};

export const sendMessageFunction = async (authtoken, data) => {
  return await axios.post(`http://localhost:5000/api/sendMessage`, data, {
    headers: {
      authtoken: authtoken,
    },
  });
};
export const fetchMessageFunction = async (authtoken, fileUploadId) => {
  return await axios.get(
    `http://localhost:5000/api/fetchMessages/${fileUploadId}`,
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};
