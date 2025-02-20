
import { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { db } from '../../firebase/firebase';
import AppContext from '../../contexts/app-context';
import Heading from '../../components/heading';
import FeedbackModal from '../../components/feedback-modal';
import FeedBackDetails from '../../components/feedback-details';

const Feedbacks = () => {
    const [feedbackModal, showFeedbackModal] = useState(false);
    const [feedbacks, setFeedbacks] = useState({});
    const [users, setUsers] = useState({});
    const [feedBackDetail, showFeedBackDetail] = useState(null);
    const store = useContext(AppContext);


    // Retrieve All Feedbacks if logged in user is Admin. Otherwise retrieve only Logged in user Feebacks
    useEffect(() => {
        if (store.user) {
            if (store.user.role === 'user') {
                db.child('feedbacks').orderByChild('userId').equalTo(store.user.userId).on("value", (snapshot) => {
                    let obj = snapshot.val();
                    if (obj) {
                        setFeedbacks(obj);
                    }
                });
            } else {
                db.child('feedbacks').on("value", (snapshot) => {
                    let obj = snapshot.val();
                    if (obj) {
                        setFeedbacks(obj);
                    }
                });

                db.child('users').on("value", (snapshot) => {
                    let obj = snapshot.val();
                    if (obj) {
                        setUsers(obj);
                    }
                });
            }
        }
    }, [store.user]);


    // Show Feedback Detail Modal
    const showFeedBackDetails = (feeback, feedBackID) => {
        db.child('users/' + feeback.userId).once("value", (snapshot) => {
            let obj = snapshot.val();
            if (obj) {
                const feedBackDetailClone = { ...feeback, feedBackID, user: obj };
                showFeedBackDetail(feedBackDetailClone);
            }
        });
    };
    return (
        <>
            <Heading title='Feedbacks' hideButton={store.user ? store.user.role !== 'user' : true} onClickButton={() => showFeedbackModal(!feedbackModal)} containerClass='mt-3' />
            <div className='mx-3'>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Feedback</th>
                            {store.user && store.user.role === 'admin' && (
                                <th>User</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Looping through Feedback records */}
                        {
                            Object.keys(feedbacks).map((record, recordIndex) => (
                                <tr key={record} className='clickable-item' onClick={() => showFeedBackDetails(feedbacks[record], record)}>
                                    <td>{recordIndex + 1}</td>
                                    <td>{feedbacks[record].feedback}</td>
                                    {store.user && store.user.role === 'admin' && (
                                        <td>{users[feedbacks[record].userId] && users[feedbacks[record].userId].username}</td>
                                    )}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            {/* Modal for Adding new Feedback */}
            <FeedbackModal show={feedbackModal} handleClose={() => showFeedbackModal(!feedbackModal)} />

            {/* Modal for showing specific Feedback details and its responses from Admin */}
            {
                feedBackDetail && (
                    <FeedBackDetails show={feedBackDetail} handleClose={() => showFeedBackDetail(null)} />
                )
            }
        </>
    );
}

export default Feedbacks;