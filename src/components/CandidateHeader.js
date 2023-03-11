import React from "react";
import logos from "../images/mylogo4.png"

export default function CandidateHeader(){

    return(
        <header className="header__candidate">
            <img className="logo" src={logos} alt="cleverhire_logo"/>
            <nav>
                <ul className="nav__links">
                    <li><a href="#">Мои задания</a></li>
                </ul>
            </nav>
        </header>
    )

}