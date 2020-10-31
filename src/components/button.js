import { Button } from 'react-bootstrap';

const DefaultButton = ({ title, onClick, type = 'button', className = '', loading, variant = 'primary', ...others }) => {
    return (
        <Button {...others} variant={variant} onClick={onClick} type={type} required={true} className={className}>{loading ? 'Loading' : title}</Button>
    );
}

export default DefaultButton;