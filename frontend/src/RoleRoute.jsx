import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {AuthContext} from "./context/AuthContext";

const RoleRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, role } = useContext(AuthContext);

    if (!isAuthenticated || role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default RoleRoute;
