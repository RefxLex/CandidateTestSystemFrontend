import React, { useState, useEffect, useContext } from "react";
import "./Missing.css";

function Error(){

    const [status, setStatus] = useState("");
    const [statusText, setStatusText] = useState("");
    const [error, setError] = useState("");
    const [hint, setHint] = useState("");

    useEffect(() => {

        let status = sessionStorage.getItem("status");
        let statusText = sessionStorage.getItem("statusText");
        let error = sessionStorage.getItem("error");

        if(status!==null){
            setStatus(status);
        }
        if(statusText!==null){
            if(statusText===""){
                defineStatusText(status);
            }
        }
        if(error!==null){
            setError(error);
        }

    },[])

    function defineStatusText(status){
        let stCode = parseInt(status);
        if(stCode==400){
            setStatusText("Bad Request")
        }
        if(stCode==401){
            setStatusText("Unauthorized");
            setHint("Пользователь не авторизован либо срок действия токена истёк");
        }
        if(stCode==403){
            setStatusText("Forbidden")
        }
        if(stCode==404){
            setStatusText("Not Found")
        }
        if(stCode==500){
            setStatusText("Internal Server Error")
        }
        if(stCode==502){
            setStatusText("Bad Gateway")
        }
    }

    return (
        <div className="missing">
            <h1>Error {status}</h1>
            <p>{statusText}</p>
            <p>{hint}</p>
            <p>{error}</p>
            <div className="missing-choice">
                <a href="/">Go home</a>
                <a href="/login">Login</a>
            </div>
        </div>
    )
    
}

export default Error;