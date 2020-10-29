import { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link } from "react-router-dom";
const Register = () => {
    const [validated, setValidated] = useState(false);
    const login = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    }
    return (
        <Form noValidate validated={validated} onSubmit={login} className='auth-form'>
            <DefaultFormGroup required={true} type='text' label='Username' placeholder='Enter username' controlId='formBasicUsername' />
            <DefaultFormGroup required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
            <DefaultFormGroup required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
            <Link to='login' className='d-block'>Already a registered User ?</Link>
            <DefaultButton className='float-right' type='submit' title='Register' onClick={() => {

            }} />
        </Form>
    );
}

export default Register;