import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import { auth, db } from './firebase/firebase';
import { Spinner } from 'react-bootstrap';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/home/dashboard';
import Bookings from './pages/home/bookings';
import Slots from './pages/home/slots';
import Feedbacks from './pages/home/feedback';
import AppBar from './components/appbar';
import PrivateRoute from './routes/protected-route';
import PublicRoute from './routes/public-route';
import AppContext from './contexts/app-context';
import './styles/auth.css';
import './styles/appbar.css';
import './styles/general.css';
import './styles/booking-form.css';
import './styles/slot.css';
import './styles/feedback.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initializing: true
  });
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState(null);
  const [slots, setSlots] = useState(null);

  useEffect(() => auth().onAuthStateChanged(user => {

    // Check if the user is authenticated or not
    if (user) {
      setAuthState({
        authenticated: true,
        initializing: false
      });

      db.child('users/' + user.uid).once("value", (snapshot) => {
        let obj = snapshot.val();
        setUser(obj);
      }).then(() => {
        db.child('locations').on("value", (snapshot) => {
          let obj = snapshot.val();
          setLocations(obj);
        });
        
        db.child('slots').on("value", (snapshot) => {
          let obj = snapshot.val();
          setSlots(obj);
        });
      })

    } else {
      setAuthState({
        authenticated: false,
        initializing: false
      });
    }
  }), [setAuthState]);

  // Show loading while checking authorization of User
  if (authentication.initializing) {
    return <Spinner animation="grow" className='splashLoader' />;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        locations,
        slots
      }}>
      <Router>
        <div>
          {
            authentication.authenticated && (
              <AppBar />
            )
          }
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <PrivateRoute path="/" authenticated={authentication.authenticated} exact={true} component={Dashboard} />
            <PrivateRoute path="/slots/:locationId" authenticated={authentication.authenticated} exact={true} component={Slots} />
            <PrivateRoute path="/bookings" authenticated={authentication.authenticated} exact={true} component={Bookings} />
            <PrivateRoute path="/feedbacks" authenticated={authentication.authenticated} exact={true} component={Feedbacks} />
            <PublicRoute path="/login" authenticated={authentication.authenticated} exact={true} component={Login} />
            <PublicRoute path="/register" authenticated={authentication.authenticated} exact={true} component={Register} />
          </Switch>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
