import React from "react";
import logos from "../images/mylogo4.png"

function AdminHeader(){

    return(
        <header className="header__admin">
            <img className="logo" src={logos} alt="cleverhire_logo"/>
            <nav>
                <ul className="nav__links">
                    <li><a href="#">Кандидаты</a></li>
                    <li><a href="#">Назначенные задания</a></li>
                    <li><a href="#">Задачи</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AdminHeader