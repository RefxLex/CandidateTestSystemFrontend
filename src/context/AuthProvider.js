import React, { useEffect } from "react";
import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const[auth, setAuth] = useState({});
    
    const id = sessionStorage.getItem("id");
    const role = sessionStorage.getItem("role");

    useEffect( () => {
        console.log("auth rendered");
        setAuth({
            id: id,
            roles: [role]
        })
    },[])

    return(
        <AuthContext.Provider value={ {auth, setAuth} }>
            {children}
        </AuthContext.Provider>
        
    )
}

export default AuthContext;