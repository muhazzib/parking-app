import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { auth, db } from '../../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';

const Login = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const history = useHistory();

    // function for logging in the user in the app
    const login = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        // check if all form fields are validated
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);

            // Call Firebase method of Logging In the User
            auth().signInWithEmailAndPassword(user.email, user.password).then((res) => {
                // Retrieve newly login user in firebase database
                db.child('users/' + auth().currentUser.uid).once("value", (snapshot) => {
                    let obj = snapshot.val();
                    localStorage.setItem('user', JSON.stringify(obj));
                    setLoading(false);
                    history.push('/');
                });
            }).catch((err) => {
                setLoading(false);
                toast.error(err.message);
            });
        }
    };

    // Get Email and Password of the User
    const getFormValues = (ev) => {
        setUser({
            ...user,
            [ev.target.name]: ev.target.value
        })
    }

    return (
        <div className='auth-container'>
            <Form validated={validated} onSubmit={login} className='auth-form'>
                <img src='https://images.vexels.com/media/users/3/144356/isolated/preview/52fb168f1bd3abf7e97a8e9bfdac331d-speed-car-logo-by-vexels.png' />
                <DefaultFormGroup onChange={getFormValues} name='email' required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
                <DefaultFormGroup onChange={getFormValues} name='password' required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
                <Link to='register' className='d-block'>Don't have an Account ?</Link>
                <DefaultButton disabled={loading} loading={loading} className='float-right' type='submit' title='Login' />
                <ToastContainer />
            </Form>
        </div>
    );
}

export default Login;