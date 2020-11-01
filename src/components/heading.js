import DefaultButton from './button';

// Default Heading with Add Button (Used throughout the App)
const Heading = ({ hideButton, containerClass = '', onClickButton, title = '' }) => {
    return (
        <div className={`d-flex justify-content-between align-items-center mx-3 ${containerClass}`}>
            <h2>{title}</h2>
            {
                !hideButton && (
                    <DefaultButton title='Add' onClick={onClickButton}/>
                )
            }
        </div>
    );
}

export default Heading;