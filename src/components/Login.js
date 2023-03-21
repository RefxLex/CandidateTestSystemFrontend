import React, { useRef, useState, useEffect } from "react";
import Header from "./Header";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "../api/axios";
const LOGIN_URL = '/api/auth/signin';

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

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({
                    email: email,
                    password: pwd
                }), 
                {
                    headers:{'Content-Type':'application/json'}
                }
            );
            //const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const id = response?.data?.id;
            sessionStorage.setItem("id", id);
            sessionStorage.setItem("role", roles.at(0));
            setAuth({
                id: id,
                roles: [roles.at(0)]
            })
            //setAuth({id:id, email:email, pwd:pwd, roles:roles});
            setEmail('');
            setPwd('');
            //navigate(from, { replace: true });
            navigate('/');
            
        } catch (err) {
            if(!err?.response){
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unautherized');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }


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