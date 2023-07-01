const { combineReducers } = require("redux");
const { userReducer } = require("./userReducer");

const reducer = combineReducers({
  auth: userReducer,
});
export default reducer;
