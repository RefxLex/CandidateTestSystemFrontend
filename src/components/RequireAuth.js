import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

import React, { useContext } from "react";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext)
    const location = useLocation();

    console.log("roles:" + auth.roles);
    console.log("id:" + auth.id);
    console.log("allowed:" + allowedRoles);
    // outlet represent any child components nested inside RequireAuth
    return(

        auth?.id
            ? auth?.roles?.find(role => allowedRoles?.includes(role)) ? <Outlet /> : <Navigate to="/unauthorized" />
            : <Navigate to="/login" /> 
            
    )
}

// state={{ from: location }} replace

export default RequireAuth;