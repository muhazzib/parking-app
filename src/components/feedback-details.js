import { useEffect, useState, useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { Modal, Form } from 'react-bootstrap';
import { db, auth } from '../firebase/firebase';
import DefaultFormGroup from './form-group';
import DefaultButton from './button';
import AppContext from '../contexts/app-context';
import moment from 'moment';


const FeedBackDetails = ({ show, handleClose }) => {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedBackDetail, setFeedBackDetail] = useState(null);
    const [reply, setReply] = useState({ text: '' });
    const [messages, setMessages] = useState(null);
    const store = useContext(AppContext);

    // fetch admin responses of a feedback when modal is open
    useEffect(() => {
        if (show) {
            setFeedBackDetail(show);
            db.child('messages').orderByChild('feedBackID').equalTo(show.feedBackID).on("value", (snapshot) => {
                let obj = snapshot.val();
                if (obj) {
                    setMessages(obj);
                }
            });
        }
    }, [show]);

    // function to get admin reply from text area
    const getFormValues = (ev) => {
        setReply({
            ...reply,
            [ev.target.name]: ev.target.value
        })
    };

    // function for sending reply to Feeback
    const sendMessage = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const replyClone = { ...reply };
            replyClone.userId = auth().currentUser.uid;
            replyClone.date = moment().format();
            replyClone.feedBackID = feedBackDetail.feedBackID;
            setLoading(true);
            setValidated(true);
            db.child('messages/').push(replyClone).then(() => {
                setLoading(false);
                setReply({ text: '' })
            });
        }
    };

    return (
        <>
            <Modal
                show={feedBackDetail !== null}
                onHide={handleClose}
                keyboard={false}
                size='lg'
            >
                <Modal.Header><b>Feedback Detail</b></Modal.Header>
                <Modal.Body>
                    <p>{feedBackDetail && feedBackDetail.feedback}</p>

                    {/* Looping through all responses from Admin  */}
                    {
                        messages && Object.keys(messages).length && (
                            <div className='chat-main-container mb-1'>
                                {
                                    Object.keys(messages).map((record) => {
                                        return (<div className="chat-container">
                                            <p>Admin {'->'} {messages[record].text}</p>
                                            <span className="time-right">{moment(messages[record].date).format("YYYY-MM-DD")}</span>
                                            <br />
                                            <span className="time-right">{moment(messages[record].date).format("hh:mm:ss a")}</span>
                                        </div>)
                                    })
                                }
                            </div>
                        )
                    }

                    {/* Form for responding to Feedback */}
                    {store.user && store.user.role === 'admin' && (
                        <Form noValidate validated={validated} onSubmit={sendMessage}>
                            <DefaultFormGroup value={reply.text} className='reply-textarea' as='textarea' onChange={getFormValues} name='text' required={true} label='Reply' placeholder='Enter Your Reply' controlId='formBasicFeedback' />
                            <DefaultButton loading={loading} className='float-right' type='submit' title='Save' />
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
}

export default FeedBackDetails;