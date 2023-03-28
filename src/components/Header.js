import React from "react";
import { useContext } from "react";
import logos from "../images/mylogo4.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";


export default function Header(){

    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogin(){
        navigate("/login");
    }

    const logout = async () => {
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        setAuth({});
        navigate('/');
    }

    function imgNav(){
        navigate("/");
    }
    
    function roleNav(){

        if(auth?.roles?.includes("ROLE_USER")){
            navigate("/user");
        }else if(auth?.roles?.includes("ROLE_MODERATOR")){
            navigate("/moderator");
        }else if (auth?.roles?.includes("ROLE_ADMIN")){
            navigate("/admin");
        }else{
            navigate("/login");
        }
    }

    return(
        <header>
            <img className="logo" src={logos} alt="cleverhire_logo" onClick={imgNav}/>
            <nav>
                <ul className="nav__links">
                    <li><a href="#">О проекте</a></li>
                    <li><a href="#">Контакты</a></li>
                </ul>
            </nav>
            <div>
                {auth?.id 
                    ?<button className="header__logout__button" onClick={logout}>Выйти</button>
                    :<button className="header__main__button" onClick={handleLogin}>Войти</button>
                }
                {auth?.id
                    ?<button className="header__main__button" onClick={roleNav}>Продолжить</button>
                    :false
                }
            </div>
        </header>
    )
}