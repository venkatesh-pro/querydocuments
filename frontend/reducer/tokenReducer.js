let initialState = null;

export const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return action.payload;
    case "REMOVE_TOKEN":
      return action.payload;
    default:
      return state;
  }
};
