
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
        let value = ev.target.value;
        const bookingClone = { ...booking };

        if (ev.target.name === 'startingTime') {
            const startingTimeInUTC = moment.utc(booking.date + ' ' + ev.target.value).format();
            value = startingTimeInUTC;
            if (bookingClone.endingTime) {
                bookingClone.endingTime = moment.utc(startingTimeInUTC).add(Number(bookingClone.noOfHours), 'hours').format();
            }
        }

        if (ev.target.name === 'endingTime') {
            const endingTimeInUTC = moment.utc(booking.startingTime).add(Number(ev.target.value), 'hours').format();
            bookingClone.noOfHours = ev.target.value;
            value = endingTimeInUTC;
        }
        setBooking({
            ...bookingClone,
            [ev.target.name]: value
        });

    };

    const addBooking = () => {

        const bookingClone = { ...booking };
        bookingClone.userId = auth().currentUser.uid;
        bookingClone.locationId = params.locationId;

        if (bookingClone.date && bookingClone.slotId && bookingClone.startingTime && bookingClone.endingTime) {
            setLoading(true);
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
    };

    const checkAvailability = (slotToCheck, bookingDate, startingTime, endingTime, prevBookings = {}) => {
        const matchedBooking = Object.keys(prevBookings).filter((record) => {
            const startTimeToCompare = moment.utc(startingTime).isBetween(moment.utc(prevBookings[record].startingTime), moment.utc(prevBookings[record].endingTime));
            const endTimeToCompare = !startTimeToCompare && endingTime >= prevBookings[record].endingTime ? true : moment.utc(endingTime).isBetween(moment.utc(prevBookings[record].startingTime), moment.utc(prevBookings[record].endingTime));
            if (prevBookings[record].slotId === slotToCheck) {
                console.log(startTimeToCompare, 'startTimeToCompare');
                console.log(endTimeToCompare, 'endTimeToCompare');
            }

            return prevBookings[record].slotId === slotToCheck && prevBookings[record].date === bookingDate && (startTimeToCompare || endTimeToCompare);
        }).reduce((res, key) => (res[key] = prevBookings[key], res), {});
        if (!Object.keys(matchedBooking).length) {
            return true;
        };
        return false;
    };

    return (
        <>
            <Heading title={`${location.name} Slots`} hideButton={store.user.role !== 'admin'} onClickButton={() => showSlotModal(!slotModal)} containerClass='mt-3' />
            {console.log(booking, '---bok')}
            {
                store.user.role === 'user' && (
                    <div className='booking-form'>
                        <DefaultFormGroup value={booking.date} onChange={getFormValues} name='date' required={true} type='date' label='Parking Date' placeholder='Select parking date' controlId='formBasicParkingDate' />
                        <DefaultFormGroup value={booking.startingTime} disabled={!booking.date} onChange={getFormValues} name='startingTime' required={true} type='time' label='Parking Time' placeholder='Select parking time' controlId='formBasicParkingTime' />
                        <Form.Group controlId="formBasicParkingHours">
                            <Form.Label>Select parking hours</Form.Label>
                            <Form.Control value={booking.noOfHours} as="select" custom onChange={getFormValues} name='endingTime' disabled={!booking.date || !booking.startingTime}>
                                <option value='' disabled selected>Select no of hours</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                            </Form.Control>
                        </Form.Group>
                        <DefaultButton loading={loading} className='float-right' type='button' title='Book' onClick={addBooking} />
                    </div>
                )
            }

            <div className='mx-3'>
                <Row>
                    {
                        Object.keys(slots).map((record, recordIndex) => {
                            const isFormFilled = booking.date && booking.startingTime && booking.endingTime;
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