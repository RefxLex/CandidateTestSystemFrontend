import React, { useState, useEffect } from "react";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import "./UserProfile.css";
import CustomRequest from "../../hooks/CustomRequest";

function UserProfile(){

    const id = localStorage.getItem("id");
    const [user, setUser] = useState();

    useEffect( () => {
        const userPromise = CustomRequest.doGet(baseURL + "/api/user/" + id);
        userPromise.then((data) => setUser(data));
    },[]);

    return(
        <div>
            <HeaderWork/>
            <div className="user-profile">
                <p>{user?.fullName}</p>
                <ul className="user-details-contacts">
                    <li>{user?.email}</li>
                    <li>{user?.phone}</li>
                </ul>
            </div>
        </div>
    )
}

export default UserProfile;