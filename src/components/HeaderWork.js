import React from "react";
import logos from "../images/mylogo4.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

function HeaderWork(){

    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    return(
        <header>
            <img className="logo" src={logos} alt="cleverhire_logo"/>
            <nav>
                <ul className="nav__links">
                    { ((auth?.roles?.includes("ROLE_MODERATOR")) || (auth?.roles?.includes("ROLE_ADMIN"))) 
                        ?<li><a href="#">Кандидаты</a></li>
                        : false
                    }
                    { ((auth?.roles?.includes("ROLE_MODERATOR")) || (auth?.roles?.includes("ROLE_ADMIN"))) 
                        ?<li><a href="#">Назначенные задания</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_ADMIN"))
                        ?<li><a href="#">Задачи</a></li>
                        : false
                    }
                    { (auth?.roles?.includes("ROLE_USER"))
                        ?<li><a href="#">Мои задания</a></li>
                        : false
                    }
                </ul>
            </nav>
            <div>
                <button className="header__main__button">Профиль</button>
            </div>
        </header>
    )
}

export default HeaderWork