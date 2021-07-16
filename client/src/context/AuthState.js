import React, { useReducer } from "react";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import { LOGOUT, LOGIN } from "./types";

const AuthState = (props) => {
  const initialState = {
    // token: null,
    token: localStorage.getItem("token"),
    userId: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  //   const setToken = (token) => {
  //     dispatch({
  //       type: SETTOKEN,
  //       payload: token,
  //     });
  //   };
  //   const setuserId = (userId) => {
  //     dispatch({
  //       type: SETUSER,
  //       payload: userId,
  //     });
  //   };
  const login = (token, userId, tokenExpiration) => {
    // console.log(token, userId);
    dispatch({
      type: LOGIN,
      payload: {
        token,
        userId,
      },
    });
  };
  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        userId: state.userId,
        login,
        logout,
        // setuserId,
        // setToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
