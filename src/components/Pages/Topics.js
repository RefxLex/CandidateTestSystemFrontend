import React, { useState , useEffect } from "react";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import "./Topics.css";
import CustomRequest from "../../hooks/CustomRequest";
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';

function Topics(){

    const [topics, setTopics] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState();
    const [inputModal, setInputModal] = useState(false);
    const [newTopic, setNewTopic] = useState("");
    const [order, setOrder] = useState("ASC");

    
    useEffect( () => {
        const topicsPromise = CustomRequest.doGet(baseURL + "/api/topic/all");
        topicsPromise.then( (data) => setTopics(data));
    },[])

    function onChange(event){
        const { value, name } = event.target;
        setNewTopic(value)
    }

    function handleAdd(event){
        event.preventDefault();
        let body = {
            name: newTopic
        }
        const topicPromise = CustomRequest.doPostWithBody(baseURL + "/api/topic/create", body);
        topicPromise.then( (data) => setTopics([...topics, data]));
        setInputModal(!inputModal);
    }

    function handleEdit(event){
        event.preventDefault();
        let topic = topics.at(editId);
        let body = {
            name: newTopic
        }
        const topicPromise = CustomRequest.doPutWithBody(baseURL + "/api/topic/" + topic.id, body);
        topicPromise.then(() => location.reload());
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
        let topic = topics.at(id);
        setNewTopic(topic.name);
        setInputModal(!inputModal);
    }

    const sorting = (col) => {
        if(order==="ASC"){
            const sorted = [...topics].sort( (a,b) =>
                a[col] > b[col] ? 1 : -1
            );
            setTopics(sorted)
            setOrder("DSC");
        }
        if(order==="DSC"){
            const sorted = [...topics].sort( (a,b) =>
                a[col] < b[col] ? 1 : -1
            );
            setTopics(sorted)
            setOrder("ASC");
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
                                            ? <span>Изменить раздел</span>
                                            : <span>Новый раздел</span>
                                    } 
                                </div>
                                <div>
                                    <label htmlFor="topicName">Название:</label>
                                </div>
                                <div>
                                        <input
                                            id="topicName"
                                            className="task-modal-input"
                                            name="name"
                                            onChange={onChange}
                                            value={newTopic}
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
            <div className="topics">
                <div className="task_invite_button_container">
                    <button onClick={ () => setInputModal(!inputModal)} className="user-details-accept-button">Добавить раздел</button>
                </div>
                <table className="assign-task-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th onClick={() => sorting("name")} >Название</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            topics.map( (topic, rowId) =>
                            <tr key={rowId}>
                                <td>
                                    <img id={rowId} onClick={openEdit} src={edit_icon} alt="edit" className="user-details-edit-icon"/>
                                </td>
                                <td className="assign-task-table-column">{topic.name}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Topics