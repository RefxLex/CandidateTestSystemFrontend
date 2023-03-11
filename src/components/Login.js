import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Login(props){

    const [userCredentials, setUserCredentials] = useState({
        email:"",
        password:""
    })

    function handleChange(event){
        const {name, value} = event.target
        setUserCredentials(prevUserCredentials => (
            {
                ...prevUserCredentials,
                [name]: value
            }
        ))
    }

    function handleSubmit(event){
        event.preventDefault()
        //fetch
        //props.updateStateUserProfile( fetchresult )
        props.updateStateUserProfile({
            role:"superuser"
        })
        /*
        switch (key) {
            case value:
                
                break;
        
            default:
                break;
        }
        if(data.role != "superuser"){
            navigate('/');
        }*/
        //console.log(userCredentials)
    }

    return(
        <div>
            <Header/>
            <div className="center">
            <h1>Авторизация</h1>
                <form onSubmit={handleSubmit}>
                    <div className="txt_field">
                        <input
                            type="email"
                            required
                            name="email"
                            value={userCredentials.email}
                            onChange={handleChange}
                        />
                        <label>Эл. почта</label>
                    </div>
                    <div className="txt_field">
                        <input
                            type="password"
                            required
                            name="password"
                            value={userCredentials.password}
                            onChange={handleChange}
                        />
                        <label>Пароль</label>
                    </div>
                    <input 
                        type="submit"
                        value="Вход"
                    />
                </form>
            </div>
        </div>
    )
}

export default Login