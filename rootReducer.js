import { combineReducers } from "@reduxjs/toolkit";
import modal from "./redux/modalSlice";

const rootReducer = combineReducers({
  modal,
});

export default rootReducer;
