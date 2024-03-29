import { useNavigate } from "react-router-dom";
import React from "react";
import "./Unauthorized.css"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="unauthorized">
            <section>
                <h1>Unauthorized</h1>
                <br />
                <p>You do not have access to the requested page.</p>
                <div className="flexGrow">
                    <button onClick={goBack}>Go Back</button>
                </div>
            </section>
        </div>
    )
}

export default Unauthorized