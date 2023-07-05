import axios from "axios";

export const fileUploadFunction = async (authtoken, file) => {
  return await axios.post(`http://localhost:5000/api/uploadFile`, file, {
    headers: {
      authtoken: authtoken,
    },
  });
};
