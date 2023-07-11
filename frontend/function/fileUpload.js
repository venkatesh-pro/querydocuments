import api from "../utils/http-client";

export const fileUploadFunction = async (authtoken, file) => {
  return await api.post(`/uploadFile`, file, {
    headers: {
      authtoken: authtoken,
    },

    onUploadProgress: (progressData) => {
      console.log(progressData);
    },
  });
};
