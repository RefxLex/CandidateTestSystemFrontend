import React from "react";
import ErrorContext from "../context/ErrorContext";

class CustomRequest{

    static async doGet(resourceURL){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"GET",
                credentials: "include"
            })
            if(response.ok){

            }
            
            else {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        } 
    }

    static async doPostWithBody(resourceURL, body){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    static async doPostEmpty(resourceURL){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  }
            });
            if (!response.ok) {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    static async doPutWithBody(resourceURL, body){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    static async doPutEmpty(resourceURL){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  }
            });
            if (!response.ok) {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    static async doDelete(resourceURL){
        ErrorContext.cleanErrors();
        try{
            const response = await fetch (resourceURL, {
                method:"DELETE",
                credentials: "include"
            });
            if (!response.ok) {
                ErrorContext.setErrorState(response.status, response.statusText);
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            return result;
        }
        catch(error){
            ErrorContext.setNetworkError(error);
            console.error("There has been a problem with your fetch operation:", error);
        }
    }
}

export default CustomRequest;