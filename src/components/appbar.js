import { useContext } from 'react';
import { Navbar, Form, Button, FormControl } from 'react-bootstrap';
import AppContext from '../contexts/app-context';
import DefaultButton from './button';
import { auth } from '../firebase/firebase';


const AppBar = () => {
    const store = useContext(AppContext);

    const logout = () => {
        auth().signOut().then(function () {
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        });
    }

    return (
        <Navbar className='appbar'>
            <Navbar.Brand>Smart Parking</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className='mr-2'>
                    Signed in as: {store.user.username}
                </Navbar.Text>
                <DefaultButton title='Logout' onClick={logout} />
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppBar;