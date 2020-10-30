import { useState } from 'react';
import { Form } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link, useHistory } from "react-router-dom";
import { auth, db } from '../../firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const history = useHistory();

    const login = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
            auth().signInWithEmailAndPassword(user.email, user.password).then((res) => {
                console.log(auth().currentUser.uid, 'auth().currentUser.uid')
                db.child('users/' + auth().currentUser.uid).once("value", (snapshot) => {
                    let obj = snapshot.val();
                    localStorage.setItem('user', JSON.stringify(obj));
                    history.push('/');
                });
            }).catch((err) => {
                toast.error(err.message);
            });
            setLoading(false);
        }
    };

    const getFormValues = (ev) => {
        setUser({
            ...user,
            [ev.target.name]: ev.target.value
        })
    }

    return (
        <Form noValidate validated={validated} onSubmit={login} className='auth-form'>
            <DefaultFormGroup onChange={getFormValues} name='email' required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
            <DefaultFormGroup onChange={getFormValues} name='password' required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
            <Link to='register' className='d-block'>Already a registered User ?</Link>
            <DefaultButton loading={loading} className='float-right' type='submit' title='Login'/>
            <ToastContainer />
        </Form>
    );
}

export default Login;