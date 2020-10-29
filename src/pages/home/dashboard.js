
import { useContext } from 'react';
import AppContext from '../../contexts/app-context';

const Dashboard = () => {
    const store = useContext(AppContext);
    return (
        <>
        <h1>Welcome</h1>
        </>
    );
}

export default Dashboard;