import DefaultButton from './button';

const Heading = ({ hideButton, containerClass = '', onClickButton }) => {
    return (
        <div className={`d-flex justify-content-between align-items-center mx-3 ${containerClass}`}>
            <h2>Locations</h2>
            {
                !hideButton && (
                    <DefaultButton title='Add' onClick={onClickButton}/>
                )
            }
        </div>
    );
}

export default Heading;