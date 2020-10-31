import { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import DefaultFormGroup from './form-group';
import DefaultButton from './button';
import { ToastContainer, toast } from 'react-toastify';
import { db, auth } from '../firebase/firebase';


const FeedbackModal = ({ show, handleClose }) => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({
        feedback: ''
    });

    const addFeedback = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const feebackClone = { ...feedback };
            feebackClone.userId = auth().currentUser.uid;
            setLoading(true);
            setValidated(true);
            db.child('feedbacks/').push(feebackClone).then(() => {
                setLoading(false);
                toast.success('Feedback has been added successfully');
                handleClose();
            });
        }
    };

    const getFormValues = (ev) => {
        setFeedback({
            ...feedback,
            [ev.target.name]: ev.target.value
        })
    }
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
                size='lg'
            >
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={addFeedback}>
                        <DefaultFormGroup className='feedback-textarea' as='textarea' onChange={getFormValues} name='feedback' required={true} label='Feedback' placeholder='Enter feedback' controlId='formBasicFeedback' />
                        <DefaultButton loading={loading} className='float-right' type='submit' title='Save' onClick={addFeedback} />
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default FeedbackModal;