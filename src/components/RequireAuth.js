import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

import React, { useContext} from "react";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext)
    const location = useLocation();

    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    // outlet represent any child components nested inside RequireAuth
    return(

        /*
        auth?.id
            ? auth?.roles?.find(role => allowedRoles?.includes(role)) ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace/>
            : <Navigate to="/login" state={{ from: location }} replace/> 
        */
   
        id 
            ? (allowedRoles.includes(role)) 
                ? <Outlet /> 
                : <Navigate to="/unauthorized" state={{ from: location }} replace/>
            : <Navigate to="/login" state={{ from: location }} replace/> 
        
    )
}

export default RequireAuth;