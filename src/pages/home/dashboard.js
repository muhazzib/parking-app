
import { useContext, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import AppContext from '../../contexts/app-context';
import Heading from '../../components/heading';
import LocationModal from '../../components/location-modal';

const Dashboard = () => {
    const [locationModal, showLocationModal] = useState(false);
    const store = useContext(AppContext);
    const history = useHistory();
    return (
        <>
            <Heading title='Locations' hideButton={store.user ? store.user.role !== 'admin' : true} onClickButton={() => showLocationModal(!locationModal)} containerClass='mt-3' />
            <div className='mx-3'>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Looping through all Locations Record */}
                        {
                            store.locations && Object.keys(store.locations).map((record, recordIndex) => (
                                <tr key={record} className='clickable-item' onClick={() => history.push(`slots/${record}`)}>
                                    <td>{recordIndex + 1}</td>
                                    <td>{store.locations[record].name}</td>
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