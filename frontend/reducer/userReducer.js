let initialState = null;

if (typeof window !== "undefined") {
  if (localStorage.getItem("auth")) {
    const auth = JSON.parse(localStorage.getItem("auth"));

    initialState = auth;
  } else {
    initialState = null;
  }
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return action.payload;
    default:
      return state;
  }
};
