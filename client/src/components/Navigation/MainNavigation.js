import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/authContext";

import "./MainNavigation.css";

const MainNavigation = (props) => {
  const authContext = useContext(AuthContext);
  const { token, logout } = authContext;
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!token && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
