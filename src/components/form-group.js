import { Form } from 'react-bootstrap';

const DefaultFormGroup = ({ label, type = 'text', placeholder, controlId, required = false, onChange, value, name, disabled = false, min = '' }) => {
    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control min={min} disabled={disabled} required={required} type={type} placeholder={placeholder} onChange={onChange} value={value} name={name} />
        </Form.Group>
    );
}

export default DefaultFormGroup;