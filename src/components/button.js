import { Button } from 'react-bootstrap';

const DefaultButton = ({ title, onClick, type = 'button', className = '', loading }) => {
    return (
        <Button onClick={onClick} type={type} required={true} className={className}>{loading ? 'Loading' : title}</Button>
    );
}

export default DefaultButton;