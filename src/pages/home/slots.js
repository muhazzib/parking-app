
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../contexts/app-context';
import { db, auth } from '../../firebase/firebase';
import Heading from '../../components/heading';
import SlotModal from '../../components/slot-modal';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { useHistory, useParams } from "react-router-dom";
import DefaultFormGroup from '../../components/form-group';
import DefaultButton from '../../components/button';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';



const Slots = () => {
    const [slotModal, showSlotModal] = useState(false);
    const [slots, setSlots] = useState({});
    const [location, setLocation] = useState({});
    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState({
        date: null,
        slotId: '',
        userId: '',
        locationId: '',
        startingTime: '',
        endingTime: '',
        noOfHours: ''
    });
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
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
        console.log(ev.target.value, 'ev')
        let value = ev.target.value;
        const bookingClone = { ...booking };

        setBooking({
            ...bookingClone,
            [ev.target.name]: value
        });

    };

    const addBooking = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const bookingClone = { ...booking };
            bookingClone.userId = auth().currentUser.uid;
            bookingClone.locationId = params.locationId;
            bookingClone.startingTime = moment.utc(bookingClone.date + ' ' + bookingClone.startingTime).format();
            bookingClone.endingTime = moment.utc(bookingClone.date + ' ' + bookingClone.endingTime).format();

            if (bookingClone.slotId) {
                setLoading(true);
                setValidated(true);
                db.child('bookings/').push(bookingClone).then(() => {
                    setLoading(false);
                    setBooking({
                        date: '',
                        slotId: '',
                        userId: '',
                        locationId: '',
                        noOfHours: '',
                        startingTime: '',
                        endingTime: ''
                    })
                    toast.success('Booking has been done successfully');
                });
            }
        }
    };

    const checkAvailability = (slotToCheck, bookingDate, startingTime, endingTime, prevBookings = {}) => {
        const matchedBooking = Object.keys(prevBookings).filter((record) => {
            const startTimeToCompare = moment.utc(prevBookings[record].startingTime).isBetween(moment.utc(bookingDate + ' ' + startingTime), moment.utc(bookingDate + ' ' + endingTime));
            const endTimeToCompare = moment.utc(prevBookings[record].endingTime).isBetween(moment.utc(bookingDate + ' ' + startingTime), moment.utc(bookingDate + ' ' + endingTime));

            return prevBookings[record].slotId === slotToCheck && prevBookings[record].date === bookingDate && (startTimeToCompare || endTimeToCompare);
        }).reduce((res, key) => (res[key] = prevBookings[key], res), {});
        if (!Object.keys(matchedBooking).length) {
            return true;
        };
        return false;
    };

    const validateForm = () => {
        return booking.date && booking.startingTime && booking.endingTime;
    }
    return (
        <>
            <Heading title={`${location.name} Slots`} hideButton={store.user ? store.user.role !== 'admin' : true} onClickButton={() => showSlotModal(!slotModal)} containerClass='mt-3' />
            {
                store.user && store.user.role === 'user' && (
                    <div className='booking-form'>
                        <Form noValidate validated={validated} onSubmit={addBooking}>
                            <DefaultFormGroup value={booking.date} onChange={getFormValues} name='date' required={true} type='date' label='Parking Date' placeholder='Select parking date' controlId='formBasicParkingDate' />
                            <DefaultFormGroup value={booking.startingTime} max={booking.endingTime} required={true} disabled={!booking.date} onChange={getFormValues} name='startingTime' required={true} type='time' label='Parking Staring Time' placeholder='Select parking time' controlId='formBasicStartingParkingTime' />
                            <DefaultFormGroup value={booking.endingTime} min={booking.startingTime} required={true} disabled={!booking.startingTime} onChange={getFormValues} name='endingTime' required={true} type='time' label='Parking Ending Time' placeholder='Select parking time' controlId='formBasicEndingParkingTime' />
                            <DefaultButton disabled={!booking.date || !booking.startingTime || !booking.endingTime || !booking.slotId} loading={loading} className='float-right' type='submit' title='Book' onClick={addBooking} />
                        </Form>
                    </div>
                )
            }

            <div className='mx-3'>
                {Object.keys(slots).length > 0 && (
                    <h5>Select Slot</h5>
                )}
                <Row>
                    {
                        Object.keys(slots).map((record, recordIndex) => {
                            const isFormFilled = validateForm();
                            const isBookingAvailable = isFormFilled ? checkAvailability(record, booking.date, booking.startingTime, booking.endingTime, bookings) : false;
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