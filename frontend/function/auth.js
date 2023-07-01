import axios from "axios";

export const registerFunction = async (authtoken) => {
  return await axios.post(
    `http://localhost:5000/api/auth`,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const currentUserFunction = async (authtoken) => {
  return await axios.get(`http://localhost:5000/api/current-user`, {
    headers: {
      authtoken: authtoken,
    },
  });
};
