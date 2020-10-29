
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../contexts/app-context';
import { db } from '../../firebase/firebase';
import Heading from '../../components/heading';
import LocationModal from '../../components/location-modal';
import { Table } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

const Dashboard = () => {
    const [locationModal, showLocationModal] = useState(false);
    const [locations, setLocations] = useState({});
    const store = useContext(AppContext);
    const history = useHistory();

    useEffect(() => {
        db.child('locations').on("value", (snapshot) => {
            let obj = snapshot.val();
            if (obj) {
                setLocations(obj);
            }
        });
    }, []);
    return (
        <>
            <Heading title='Locations' hideButton={store.user.role !== 'admin'} onClickButton={() => showLocationModal(!locationModal)} containerClass='mt-3' />
            <div className='mx-3'>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(locations).map((record, recordIndex) => (
                                <tr key={record} className='clickable-item' onClick={() => history.push(`slots/${record}`)}>
                                    <td>{recordIndex + 1}</td>
                                    <td>{locations[record].name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            <LocationModal show={locationModal} handleClose={() => showLocationModal(!locationModal)} />
        </>
    );
}

export default Dashboard;