import { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { db } from '../firebase/firebase';
import DefaultFormGroup from './form-group';
import DefaultButton from './button';

// Location Modal for Adding new Locations in the system
const LocationModal = ({ show, handleClose }) => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState({
        name: ''
    });

    // function for adding new Location
    const addLocation = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
            db.child('locations/').push(location).then(() => {
                setLoading(false);
                toast.success('Location has been added successfully');
                handleClose();
            });
        }
    };

    // function to get location details
    const getFormValues = (ev) => {
        setLocation({
            ...location,
            [ev.target.name]: ev.target.value
        })
    };

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
            >
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={addLocation}>
                        <DefaultFormGroup onChange={getFormValues} name='name' required={true} type='text' label='Location Name' placeholder='Enter location name' controlId='formBasicLocationName' />
                        <DefaultButton loading={loading} className='float-right' type='submit' title='Save' onClick={addLocation} />
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default LocationModal;