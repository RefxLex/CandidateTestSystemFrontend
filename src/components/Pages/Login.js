import React, { useRef, useState, useEffect } from "react";
import Header from "../Header";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import baseURL from "../../api/baseUrl";
import "./Login.css";

function Login(){

    const { setAuth } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let body = {
            email: email,
            password: pwd
        }

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/auth/signin", {
            method:"POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else{
                if(response.status==401){
                    setErrMsg("неправильный email или пароль")
                    throw new Error("invalid email or password");
                } else {
                    sessionStorage.setItem("status", response.status);
                    sessionStorage.setItem("statusText", response.statusText);
                    navigate("/error");
                }
            }
        })
        .then(result => {
            const roles = result.roles;
            const id = result.id;
            localStorage.setItem("id", id);
            localStorage.setItem("role", roles.at(0));
            setAuth({
                id: id,
                roles: [roles.at(0)]
            })
            setEmail('');
            setPwd('');
            navigate(from, { replace: true });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return(

                <div>
                    <Header/>
                    <div className="center">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Авторизация</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="txt_field">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                                <label htmlFor="email">Эл. почта</label>
                            </div>
                            <div className="txt_field">
                            <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                                <label htmlFor="password">Пароль</label>
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