import React from "react";
import logos from "../images/mylogo4.png"


export default function Header(){
    return(
        <header className="header__home">
            <img className="logo" src={logos} alt="cleverhire_logo"/>
        </header>
    )
}