import { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import DefaultButton from '../../components/button';
import DefaultFormGroup from '../../components/form-group';
import { Link } from "react-router-dom";
const Register = () => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: ''
    })

    const register = (event) => {
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
        <Form noValidate validated={validated} onSubmit={register} className='auth-form'>
            <DefaultFormGroup onChange={getFormValues} name='username' value={user.username} required={true} type='text' label='Username' placeholder='Enter username' controlId='formBasicUsername' />
            <DefaultFormGroup onChange={getFormValues} name='email' value={user.email} required={true} type='email' label='Email Address' placeholder='Enter email' controlId='formBasicEmail' />
            <DefaultFormGroup onChange={getFormValues} name='password' value={user.password} required={true} type='password' label='Password' placeholder='Password' controlId='formBasicPassword' />
            <Link to='login' className='d-block'>Already a registered User ?</Link>
            <DefaultButton loading={loading} className='float-right' type='submit' title='Register' onClick={() => {

            }} />
        </Form>
    );
}

export default Register;