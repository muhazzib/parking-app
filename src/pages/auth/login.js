import { useState } from 'react'
import { Form } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link } from "react-router-dom";

const Login = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const login = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
            console.log(user,'user====')
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
            <DefaultButton loading={loading} className='float-right' type='submit' title='Login' onClick={() => {

            }} />
        </Form>
    );
}

export default Login;