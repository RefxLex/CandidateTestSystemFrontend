import React from "react";
import logos from "../images/mylogo4.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import "./Header.css";

function HeaderWork(){

    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    function roleNav(){

        if(auth?.roles?.includes("ROLE_USER")){
            navigate("/user");
        }else if(auth?.roles?.includes("ROLE_MODERATOR")){
            navigate("/admin");
        }else if (auth?.roles?.includes("ROLE_ADMIN")){
            navigate("/admin");
        }else{
            navigate("/login");
        }
    }

    return(
        <header>
            <img className="logo" src={logos} alt="cleverhire_logo" onClick={() => navigate("/")}/>
            <nav>
                <ul className="nav__links">
                    { ((auth?.roles?.includes("ROLE_MODERATOR")) || (auth?.roles?.includes("ROLE_ADMIN"))) 
                        ?<li><a href="/admin">Кандидаты</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_ADMIN"))
                        ?<li><a href="/tasks">Задачи</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_ADMIN"))
                        ?<li><a href="/topics">Разделы</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_ADMIN"))
                        ?<li><a href="/levels">Сложность</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_USER"))
                        ?<li><a href="/user">Мои задания</a></li>
                        : false
                    }
                </ul>
            </nav>
            <div>
                { (auth?.roles?.includes("ROLE_USER"))
                        ? <button onClick={() => navigate("/user/profile")} className="header__main__button">Профиль</button>
                        : false
                }
                {  (auth?.roles?.includes("ROLE_ADMIN"))
                        ? <button onClick={() => navigate("/admin/add")} className="header__main__button">Персонал</button>
                        : false
                }
            </div>
        </header>
    )
}

export default HeaderWork