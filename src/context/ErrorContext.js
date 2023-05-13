import React from "react";

class ErrorContext{

    static setErrorState(status, statusText){
        sessionStorage.setItem("status", status);
        sessionStorage.setItem("statusText", statusText);
    }

    static setNetworkError(error){
        sessionStorage.setItem("error", error);
    }

    static cleanErrors(){
        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
    }
}

export default ErrorContext;