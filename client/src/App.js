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

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact component={null} />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/bookings" component={Booking} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
