import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from '../../firebase/firebase';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';

const Register = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const history = useHistory();

    // function for registering the user in the app
    const register = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        // check if all form fields are validated
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);

            // Call Firebase method of Registering the User
            auth().createUserWithEmailAndPassword(user.email, user.password).then((res) => {
                const userObj = { ...user };
                delete userObj.password;

                // Add newly registered user in firebase database
                db.child('users/' + auth().currentUser.uid).set({ ...userObj, userId: auth().currentUser.uid }).then(() => {
                    db.child('users/' + auth().currentUser.uid).once("value", (snapshot) => {
                        let obj = snapshot.val();
                        localStorage.setItem('user', JSON.stringify(obj));
                        history.push('/');
                    });
                })
            }).catch((err) => {
                toast.error(err.message);
                setLoading(false);
            });
        }

    };

    // Get Email, Username, and Password of the User
    const getFormValues = (ev) => {
        setUser({
            ...user,
            [ev.target.name]: ev.target.value
        })
    }
    return (
        <div className='auth-container'>
            <Form validated={validated} onSubmit={register} className='auth-form'>
                <img src='https://images.vexels.com/media/users/3/144356/isolated/preview/52fb168f1bd3abf7e97a8e9bfdac331d-speed-car-logo-by-vexels.png' />
                <DefaultFormGroup onChange={getFormValues} name='username' value={user.username} required={true} type='text' label='Username' placeholder='Enter username' controlId='formBasicUsername' />
                <DefaultFormGroup onChange={getFormValues} name='email' value={user.email} required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
                <DefaultFormGroup onChange={getFormValues} name='password' value={user.password} required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
                <Link to='login' className='d-block'>Already have an Account ?</Link>
                <DefaultButton disabled={loading} loading={loading} className='float-right' type='submit' title='Register'/>
                <ToastContainer />
            </Form>
        </div>
    );
}

export default Register;