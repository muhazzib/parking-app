import { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import AppContext from '../contexts/app-context';
import DefaultButton from './button';
import { auth } from '../firebase/firebase';
import { useHistory } from "react-router-dom";

const AppBar = () => {
    const store = useContext(AppContext);
    const history = useHistory();

    const logout = () => {
        auth().signOut().then(function () {
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        });
    }

    return (
        <Navbar className='appbar'>
            <Navbar.Brand className='clickable-item' onClick={() => history.push('/')}>Smart Parking</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Nav.Link onClick={() => history.push('/bookings')}>{store.user && store.user.role === 'user' && 'My '}Bookings</Nav.Link>
                <Navbar.Text className='mr-2'>
                    Signed in as: {store.user && store.user.username}
                </Navbar.Text>
                <DefaultButton title='Logout' onClick={logout} />
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppBar;