
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../contexts/app-context';
import { db } from '../../firebase/firebase';
import Heading from '../../components/heading';
import { Table } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import DefaultButton from '../../components/button';
import ConfirmationModal from '../../components/confirmation-modal';


const Bookings = () => {
    const [bookings, setBookings] = useState({});
    const [confirmationModal, setConfirmationModal] = useState('');
    const store = useContext(AppContext);
    const history = useHistory();

    useEffect(() => {
        if (store.user) {
            if (store.user.role === 'user') {
                db.child('bookings').orderByChild('userId').equalTo(store.user.userId).on("value", (snapshot) => {
                    let obj = snapshot.val();
                    if (obj) {
                        setBookings(obj);
                    }
                });
            } else {
                db.child('bookings').on("value", (snapshot) => {
                    let obj = snapshot.val();
                    if (obj) {
                        setBookings(obj);
                    }
                });
            }
        }
    }, [store.user]);

    const cancelBooking = () => {
        db.child('bookings/' + confirmationModal).remove().then(() => {
            setConfirmationModal('');
        });
    }
    return (
        <>
            <Heading title='Bookings' hideButton={true} containerClass='mt-3' />
            <div className='mx-3'>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Starting Time</th>
                            <th>Ending Time</th>
                            <th>Location</th>
                            <th>Slot</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            store.locations && store.slots && Object.keys(bookings).map((record, recordIndex) => (
                                <tr key={record}>
                                    <td>{recordIndex + 1}</td>
                                    <td>{bookings[record].date}</td>
                                    <td>{moment.utc(bookings[record].startingTime).format('HH.mm')}</td>
                                    <td>{moment.utc(bookings[record].endingTime).format('HH:mm')}</td>
                                    <td>{store.locations[bookings[record].locationId].name}</td>
                                    <td>{store.slots[bookings[record].slotId].name}</td>
                                    <td className='text-center'>
                                        <DefaultButton title='Cancel Booking' variant='danger' onClick={() => setConfirmationModal(record)} />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <ConfirmationModal show={confirmationModal !== ''} title='Do you want to cancel the Booking ?' onSubmit={() => cancelBooking()} onCancel={() => setConfirmationModal('')} />
            </div>
        </>
    );
}

export default Bookings;