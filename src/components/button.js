import { Button } from 'react-bootstrap';

const DefaultButton = ({ title, onClick, type = 'button', className = '' }) => {
    return (
        <Button onClick={onClick} type={type} required={true} className={className}>{title}</Button>
    );
}

export default DefaultButton;