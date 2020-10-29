import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/auth.css';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase/firebase';

function App() {
  auth().onAuthStateChanged((user) => {
    console.log(user,'user---')
    
  });

  const logout = () => {
    auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <button onClick={logout}>Logout</button>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <h1>Home</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
