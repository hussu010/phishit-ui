import { combineReducers } from "redux";
import authReducer from "./features/auth-slice";
import usersReducer from "./features/users-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
