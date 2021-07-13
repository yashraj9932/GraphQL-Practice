import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Auth from "./components/Auth";
import Booking from "./components/Booking";
import Events from "./components/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/authContext";
import { useContext } from "react";

const App = () => {
  const authContext = useContext(AuthContext);

  return (
    <Router>
      {}
      <MainNavigation />
      <main className="main-content">
        <Switch>
          {authContext.token && <Redirect from="/" to="/events" exact />}
          {authContext.token && <Redirect from="/auth" to="/events" exact />}
          {!authContext.token && <Route exact path="/auth" component={Auth} />}
          <Route exact path="/events" component={Events} />
          {authContext.token && (
            <Route exact path="/bookings" component={Booking} />
          )}
          {!authContext.token && <Redirect to="/auth" exact />}
        </Switch>
      </main>
    </Router>
  );
};

export default App;
