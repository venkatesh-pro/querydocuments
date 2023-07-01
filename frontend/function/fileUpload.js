import axios from "axios";

export const fileUploadFunction = async (authtoken) => {
  return await axios.post(
    `http://localhost:5000/api/uploadFile`,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};
