import { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import DefaultFormGroup from './form-group';
import DefaultButton from './button';
import { ToastContainer, toast } from 'react-toastify';
import { db } from '../firebase/firebase';


const SlotModal = ({ show, handleClose, locationId }) => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [slot, setSlot] = useState({
        name: ''
    });

    const addSlot = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true);
            setValidated(true);
            const slotToAdd = { ...slot };
            slotToAdd.locationId = locationId;
            db.child('slots/').push(slotToAdd).then(() => {
                setLoading(false);
                toast.success('Slot has been added successfully');
                handleClose();
            });
        }
    };

    const getFormValues = (ev) => {
        setSlot({
            ...slot,
            [ev.target.name]: ev.target.value
        })
    }
    return (
        <>
            {console.log(locationId, 'locationId')}
            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
            >
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={addSlot}>
                        <DefaultFormGroup onChange={getFormValues} name='name' required={true} type='text' label='Slot Name' placeholder='Enter slot name' controlId='formBasicSlotName' />
                        <DefaultButton loading={loading} className='float-right' type='submit' title='Save' onClick={addSlot} />
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default SlotModal;