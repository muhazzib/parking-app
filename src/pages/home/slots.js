
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../contexts/app-context';
import { db, auth } from '../../firebase/firebase';
import Heading from '../../components/heading';
import SlotModal from '../../components/slot-modal';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from "react-router-dom";
import DefaultFormGroup from '../../components/form-group';
import DefaultButton from '../../components/button';
import { ToastContainer, toast } from 'react-toastify';


const Slots = () => {
    const [slotModal, showSlotModal] = useState(false);
    const [slots, setSlots] = useState({});
    const [location, setLocation] = useState({});
    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState({
        date: null,
        slotId: '',
        userId: '',
        locationId: ''
    });
    const [loading, setLoading] = useState(false);
    const store = useContext(AppContext);
    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        db.child('slots').orderByChild('locationId').equalTo(params.locationId).on("value", (snapshot) => {
            let obj = snapshot.val();
            if (obj) {
                setSlots(obj);
            }
        });

        db.child('bookings').orderByChild('locationId').equalTo(params.locationId).on("value", (snapshot) => {
            let obj = snapshot.val();
            console.log(obj, 'obj---')
            if (obj) {
                setBookings(obj);
            }
        });

        db.child('locations/' + params.locationId).once("value", (snapshot) => {
            let obj = snapshot.val();
            if (obj) {
                setLocation(obj);
            }
        });
    }, []);

    const getFormValues = (ev) => {
        setBooking({
            ...booking,
            [ev.target.name]: ev.target.value
        });
    };

    const addBooking = () => {

        setLoading(true);
        const bookingClone = { ...booking };
        bookingClone.userId = auth().currentUser.uid;
        bookingClone.locationId = params.locationId;
        db.child('bookings/').push(bookingClone).then(() => {
            setLoading(false);
            setBooking({
                date: '',
                slotId: '',
                userId: '',
                locationId: ''
            })
            toast.success('Location has been added successfully');
        });
    };

    const checkAvailability = (slotToCheck, bookingDate, prevBookings = {}) => {
        const matchedBooking = Object.keys(prevBookings).filter((record) => {
            return prevBookings[record].slotId === slotToCheck && prevBookings[record].date === bookingDate;
        }).reduce((res, key) => (res[key] = prevBookings[key], res), {});
        if (!Object.keys(matchedBooking).length) {
            return true;
        };
        return false;
    };

    return (
        <>
            <Heading title={`${location.name} Slots`} hideButton={store.user.role !== 'admin'} onClickButton={() => showSlotModal(!slotModal)} containerClass='mt-3' />
            <div className='booking-form'>
                <DefaultFormGroup value={booking.date} onChange={getFormValues} name='date' required={true} type='date' label='Parking Date' placeholder='Select parking date' controlId='formBasicParkingDate' />
                <DefaultButton loading={loading} className='float-right' type='button' title='Book' onClick={addBooking} />
            </div>

            <div className='mx-3'>
                <Row>
                    {
                        Object.keys(slots).map((record, recordIndex) => {
                            const isBookingAvailable = booking.date ? checkAvailability(record, booking.date, bookings) : false;
                            const isFormFilled = booking.date;
                            return (
                                <Col lg={3}>
                                    <Card key={record} className={`clickable-item ${record === booking.slotId && 'selected-slot'} ${!isBookingAvailable && isFormFilled && 'unavailable-slot'}`} onClick={() => isBookingAvailable ? setBooking({ ...booking, slotId: record }) : null}>
                                        <Card.Body>
                                            <Card.Title>{slots[record].name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
            <SlotModal show={slotModal} handleClose={() => showSlotModal(!slotModal)} locationId={params.locationId} />
            <ToastContainer />
        </>
    );
}

export default Slots;