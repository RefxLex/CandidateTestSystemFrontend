import React, { useState , useEffect } from "react";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import "./Levels.css";
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';

function Levels() {

    const [levels, setLevels] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState();
    const [inputModal, setInputModal] = useState(false);
    const [newLevel, setNewLevel] = useState("");
    const [order, setOrder] = useState("ASC");

    
    useEffect( () => {
        const levelsPromise = doGet("/api/level/all");
        levelsPromise.then( (data) => setLevels(data));
    },[])

    function onChange(event){
        const { value, name } = event.target;
        setNewLevel(value)
    }

    function handleAdd(event){
        event.preventDefault();
        let body = {
            name: newLevel
        }
        const levelPromise = doPost("/api/level/create", body);
        levelPromise.then( (data) => setLevels([...levels, data]));
        setInputModal(!inputModal);
    }

    function handleEdit(event){
        event.preventDefault();
        let level = levels.at(editId);
        let body = {
            name: newLevel
        }
        const levelPromise = doPut("/api/level/" + level.id, body);
        levelPromise.then(() => location.reload());
        setEditMode(false);
        setInputModal(!inputModal);
    }

    function handleCancel(event){
        event.preventDefault()
        setEditMode(false);
        setInputModal(!inputModal);
    }

    function openEdit(event){
        const { id } = event.target;
        setEditMode(true);
        setEditId(id);
        let level = levels.at(id);
        setNewLevel(level.name);
        setInputModal(!inputModal);
    }

    const sorting = (col) => {
        if(order==="ASC"){
            const sorted = [...levels].sort( (a,b) =>
                a[col] > b[col] ? 1 : -1
            );
            setLevels(sorted)
            setOrder("DSC");
        }
        if(order==="DSC"){
            const sorted = [...levels].sort( (a,b) =>
                a[col] < b[col] ? 1 : -1
            );
            setLevels(sorted)
            setOrder("ASC");
        }
    }

    async function doGet(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"GET",
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
        catch(error){
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    async function doPost(resourceURL, body){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
        catch(error){
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    async function doPut(resourceURL, body){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            return result;
        }
        catch(error){
            console.error("There has been a problem with your fetch operation:", error);
        }
    }

    return(
        <div>
            <HeaderWork/>
            {/* Add topic modal */}
            {
                inputModal && 
                    <div>
                         <div className="modal">
                            <div className="overlay"></div>
                            <div className="modal-content">
                                <div className="task-modal-content-label">
                                    { 
                                        editMode
                                            ? <span>Редактировать</span>
                                            : <span>Новый уровень</span>
                                    } 
                                </div>
                                <div>
                                    <label htmlFor="levelName">Название:</label>
                                </div>
                                <div>
                                        <input
                                            id="levelName"
                                            className="task-modal-input"
                                            name="name"
                                            onChange={onChange}
                                            value={newLevel}
                                        />
                                </div>
                                <div className="modal-btn-container">
                                    <button onClick={handleCancel} className="user-details-cancel-button">Отмена</button>
                                    { editMode
                                        ? <button onClick={handleEdit} className="user-details-accept-button">Сохранить</button>
                                        : <button onClick={handleAdd} className="user-details-accept-button">Добавить</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
            {/* Main content */}
            <div className="levels">
                <div className="task_invite_button_container">
                    <button onClick={ () => setInputModal(!inputModal)} className="user-details-accept-button">Добавить уровень</button>
                </div>
                <table className="assign-task-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={() => sorting("name")}>Название</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            levels.map( (level, rowId) =>
                            <tr key={rowId}>
                                <td>
                                    <img id={rowId} onClick={openEdit} src={edit_icon} alt="edit" className="user-details-edit-icon"/>
                                </td>
                                <td className="assign-task-table-column">{level.name}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default Levels;