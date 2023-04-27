import React, { useState, useEffect } from "react";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import "./UserProfile.css";

function UserProfile(){

    const id = localStorage.getItem("id");
    const [user, setUser] = useState();

    useEffect( () => {
        const userPromise = doGet("/api/user/" + id);
        userPromise.then((data) => setUser(data));
    },[]);

    async function doGet(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"GET",
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
        catch(error){
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

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