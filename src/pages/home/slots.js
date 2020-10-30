
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../contexts/app-context';
import { db } from '../../firebase/firebase';
import Heading from '../../components/heading';
import SlotModal from '../../components/slot-modal';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from "react-router-dom";

const Slots = () => {
    const [slotModal, showSlotModal] = useState(false);
    const [slots, setSlots] = useState({});
    const [location, setLocation] = useState({});
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

        db.child('locations/' + params.locationId).once("value", (snapshot) => {
            let obj = snapshot.val();
            if (obj) {
                setLocation(obj);
            }
        });
    }, []);
    return (
        <>
            <Heading title={`${location.name} Slots`} hideButton={store.user.role !== 'admin'} onClickButton={() => showSlotModal(!slotModal)} containerClass='mt-3' />
            <div className='mx-3'>
                <Row>
                    {
                        Object.keys(slots).map((record, recordIndex) => (
                            <Col lg={3}>
                                <Card key={record} className='clickable-item'>
                                    <Card.Body>
                                        <Card.Title>{slots[record].name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </div>
            <SlotModal show={slotModal} handleClose={() => showSlotModal(!slotModal)} locationId={params.locationId} />
        </>
    );
}

export default Slots;