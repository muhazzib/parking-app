import React from 'react';

import {
    Redirect,
    Route
} from "react-router-dom";

// Higher Order Component For Private Routes
const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
    return (
        <Route {...rest} render={(props) => (
            authenticated === true
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )} />
    )
}

export default PrivateRoute;