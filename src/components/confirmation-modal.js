import { Modal } from 'react-bootstrap';
import DefaultButton from './button';

const ConfirmationModal = ({ title, onSubmit, onCancel, show }) => {

    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{title}</p>
            </Modal.Body>

            <Modal.Footer>
                <DefaultButton title='Yes' onClick={onSubmit} />
                <DefaultButton variant='danger' title='No' onClick={onCancel} />
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;