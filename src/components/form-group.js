import { Form } from 'react-bootstrap';

const DefaultFormGroup = ({ label, type = 'text', placeholder, controlId, required = false }) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control required={required} type={type} placeholder={placeholder} />
        </Form.Group>
    );
}

export default DefaultFormGroup;