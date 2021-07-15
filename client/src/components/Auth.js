import "./Auth.css";
import { useState, useRef, useContext } from "react";
import AuthContext from "../context/authContext";
import { gql, useLazyQuery } from "@apollo/client";

const AuthPage = (props) => {
  const authContext = useContext(AuthContext);

  const [isLogin, setLogin] = useState(true);

  const emailEl = useRef();
  const passwordEl = useRef();

  const switchModeHandler = () => {
    setLogin(!isLogin);
  };

  const LOGIN = gql`
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        userId
        token
        tokenExpiration
      }
    }
  `;

  const SIGNUP = gql`
    mutation CreateUser($email: String!, $password: String!) {
      createUser(userInput: { email: $email, password: $password }) {
        _id
        email
      }
    }
  `;

  // const [getUser, { loading, data }] = useLazyQuery(LOGIN);
  const [getUser, obj] = useLazyQuery(LOGIN, {
    fetchPolicy: "network-only",
  });
  const [signUser, objj] = useLazyQuery(SIGNUP, {
    fetchPolicy: "network-only",
  });
  if (obj.loading) return <p>Loading ...</p>;
  console.log(obj);

  const submitHandler = (event) => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    // console.log(email, password);

    const { data } = obj;

    if (!isLogin) {
      signUser({ variables: { email, password } });
    }
    getUser({ variables: { email, password } });

    if (data && data.login.token) {
      authContext.login(
        data.login.token,
        data.login.userId,
        data.login.tokenExpiration
      );
    }
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          ref={passwordEl}
          autoComplete="on"
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
