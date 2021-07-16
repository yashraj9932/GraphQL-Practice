import "./Auth.css";
import { useState, useRef, useContext } from "react";
import AuthContext from "../context/authContext";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

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

  const [getUser] = useLazyQuery(LOGIN, {
    onCompleted(data) {
      authContext.login(
        data.login.token,
        data.login.userId,
        data.login.tokenExpiration
      );
    },
    onError(err) {
      console.log(err);
      throw err;
    },
  });
  const [signUser] = useMutation(SIGNUP, {
    onCompleted(data) {
      getUser({
        variables: {
          email: data.createUser.email,
          password: passwordEl.current.value,
        },
      });
    },
    onError(err) {
      console.log(err);
      throw err;
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    if (!isLogin) {
      signUser({ variables: { email, password } });
    } else {
      getUser({ variables: { email, password } });
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
