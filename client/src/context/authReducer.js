import { LOGIN, LOGOUT } from "./types";

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        userId: null,
      };
    default:
      return {
        ...state,
      };
  }
};

export default authReducer;
