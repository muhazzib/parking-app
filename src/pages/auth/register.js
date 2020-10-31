import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from '../../firebase/firebase';

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


    const register = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
            auth().createUserWithEmailAndPassword(user.email, user.password).then((res) => {
                const userObj = { ...user };
                delete userObj.password;
                db.child('users/' + auth().currentUser.uid).set({ ...userObj, userId: auth().currentUser.uid }).then(() => {
                    db.child('users/' + auth().currentUser.uid).once("value", (snapshot) => {
                        let obj = snapshot.val();
                        localStorage.setItem('user', JSON.stringify(obj));
                        history.push('/');
                    });
                })
            }).catch((err) => {
                toast.error(err.message);
            });
        }

    };

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
                <DefaultButton loading={loading} className='float-right' type='submit' title='Register' onClick={() => {

                }} />
                <ToastContainer />
            </Form>
        </div>
    );
}

export default Register;