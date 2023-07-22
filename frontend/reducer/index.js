import { tokenReducer } from "./tokenReducer";

const { combineReducers } = require("redux");
const { userReducer } = require("./userReducer");

const reducer = combineReducers({
  auth: userReducer,
  token: tokenReducer,
});
export default reducer;
