import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/home/dashboard';
import Slots from './pages/home/slots';
import AppBar from './components/appbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/auth.css';
import './styles/appbar.css';
import './styles/general.css';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from './firebase/firebase';
import PrivateRoute from './routes/protected-route';
import PublicRoute from './routes/public-route';
import AppContext from './contexts/app-context';
import { Spinner } from 'react-bootstrap';


function App() {
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initializing: true
  });
  const [user, setUser] = useState({});

  useEffect(() => auth().onAuthStateChanged(user => {
    if (user) {
      db.child('users/' + user.uid).once("value", (snapshot) => {
        let obj = snapshot.val();
        console.log(obj, '---=======')
        setUser(obj);
        setAuthState({
          authenticated: true,
          initializing: false
        });
      });
    } else {
      setAuthState({
        authenticated: false,
        initializing: false
      });
    }
  }), [setAuthState]);

  if (authentication.initializing) {
    return   <Spinner animation="grow" className='splashLoader'/>;
  }

  return (
    <AppContext.Provider
      value={{
        user
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
            <PublicRoute path="/login" authenticated={authentication.authenticated} exact={true} component={Login} />
            <PublicRoute path="/register" authenticated={authentication.authenticated} exact={true} component={Register} />
          </Switch>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
