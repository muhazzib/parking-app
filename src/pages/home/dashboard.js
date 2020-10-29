import { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

    const login = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
        }
    }
    return (
        <Form noValidate validated={validated} onSubmit={login} className='auth-form'>
            <DefaultFormGroup required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
            <DefaultFormGroup required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
            <Link to='register' className='d-block'>Already a registered User ?</Link>
            <DefaultButton loading={loading} className='float-right' type='submit' title='Login' onClick={() => {

            }} />
        </Form>
    );
}

export default Dashboard;