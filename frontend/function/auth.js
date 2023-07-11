import api from "../utils/http-client";

export const registerFunction = async (authtoken) => {
  return await api.post(
    `/auth`,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const currentUserFunction = async (authtoken) => {
  return await api.get(`/current-user`, {
    headers: {
      authtoken: authtoken,
    },
  });
};
