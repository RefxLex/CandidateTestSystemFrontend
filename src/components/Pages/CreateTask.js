import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTask.css";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';


function CreateTask(){

    const navigate = useNavigate();
    const [inputModal, setInputModal] = useState(false);
    const [levels, setLevels] = useState([]);
    const [topics, setTopics] = useState([]);
    const [newTaskInputArray, setNewTaskInputArray] = useState([]);
    const [taskInput, setTaskInput] = useState({
        id:"",
        input: "",
        output: ""
    });
    const [newTask, setNewTask] = useState({
        name: "",
        topicId: 9,
        difficultyId: 4,
        description: ""
    })

    useEffect (() => {

        const levelPromise = doGet("/api/level/all");
        levelPromise.then( (data) => setLevels(data));
    
        const topicPromise = doGet("/api/topic/all");
        topicPromise.then( (data) => setTopics(data));

    },[])

    
    function handleAddTask(event){
        event.preventDefault();
        let body = {
            name: newTask.name,
            topicId: newTask.topicId,
            difficultyId: newTask.difficultyId,
            description: newTask.description,
            taskTestInput: newTaskInputArray
        }
        const taskPromise = doPost("/api/task/create", body);
        taskPromise.then( (data) => navigate("/tasks"));
    }

    function handleRemove(event){
        const { id, value } = event.target;
        let newArray = [];
        for(let i=0; i<newTaskInputArray.length; i++){
            if(i != id){
               newArray.push(newTaskInputArray[i]);
            }
        }
        setNewTaskInputArray(newArray);
    }

    function handleTestDataArray(event){
        if( (taskInput.input!=="") && (taskInput.output!=="") )
        {
            setNewTaskInputArray( (prevArr) => [...prevArr, taskInput]);
            setTaskInput({
                input: "",
                output: ""
            });
        }
        setInputModal(!inputModal);
    }

    function onTaskChange(event){
        const { value, name } = event.target;
        setNewTask( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
    }

    function onTaskInputChange(event){
        const { value, name } = event.target;
        setTaskInput( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
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

    return(
        <>
            <HeaderWork/>
            {/* Add Test Input Modal */}
            {   inputModal && 
                            <>
                                 <div className="modal">
                                    <div className="overlay"></div>
                                    <div className="modal-content">
                                        <div className="task-modal-content-label">
                                            <span>Новый тест</span>
                                        </div>
                                        <div>
                                            <label htmlFor="taskInput">Входные данные:</label>
                                        </div>
                                        <div>
                                                <textarea
                                                    id="taskInput"
                                                    className="task-modal-input"
                                                    name="input"
                                                    onChange={onTaskInputChange}
                                                    value={taskInput.input}
                                                />
                                        </div>
                                        <div>
                                            <label htmlFor="description">Выходные данные:</label>
                                        </div>
                                        <div>
                                                <textarea
                                                    id="taskOutput"
                                                    className="task-modal-input"
                                                    name="output"
                                                    onChange={onTaskInputChange}
                                                    value={taskInput.output}
                                                />
                                        </div>
                                        <div className="modal-btn-container">
                                            <button onClick={() => setInputModal(!inputModal)} className="user-details-cancel-button">Отмена</button>
                                            <button onClick={handleTestDataArray} className="user-details-accept-button">Добавить</button>
                                        </div>
                                    </div>
                                </div>
                            </>
            }
            {/* Main content */}
            <div className="create-task">
                <form onSubmit={ (e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="fullName">Название</label>
                        <input
                            className="edit-task-input"
                            type="text"
                            name="name"
                            id="name"
                            onChange={onTaskChange}
                            value={newTask.name}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="topicId">Раздел</label>
                        <select className="assign-task-select"
                            id="topicId"
                            value={newTask.topicId}
                            onChange={onTaskChange}
                            name="topicId"
                        >
                        {
                            topics.map( (topic, rowId) =>
                                <option key={rowId} value={topic.id}>{topic.name}</option>
                            )
                        }
                        </select>
                    </div>
                    <div>
                        <label htmlFor="difficultyId">Сложность</label>
                        <select className="assign-task-select"
                            id="difficultyId"
                            value={newTask.difficultyId}
                            onChange={onTaskChange}
                            name="difficultyId"
                        >
                        {
                            levels.map( (level, rowId) =>
                                <option key={rowId} value={level.id}>{level.name}</option>
                             )
                        }
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description">Описание:</label>
                    </div>
                    <div>
                        <textarea
                            id="description"
                            className="task-description"
                            name="description"
                            onChange={onTaskChange}
                            value={newTask.description}
                        />
                    </div>
                </form>
                <button onClick={() => setInputModal(!inputModal)} className="user-details-cancel-button">Добавить тест </button>
                <table className="assign-task-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Номер</th>
                            <th>Вход</th>
                            <th>Выход</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            newTaskInputArray.map( (item, rowId) =>
                                <tr key={rowId}>
                                        <td>
                                            <div className="task-task-item-btns">
                                                <img onClick={handleRemove} id={rowId} src={delete_icon} alt="remove" className="user-details-edit-icon"/>
                                            </div>
                                        </td>
                                      <td className="assign-task-table-column">{rowId}</td>
                                      <td className="assign-task-table-column">{item.input}</td>
                                      <td className="assign-task-table-column">{item.output}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className="modal-btn-container">
                    <button onClick={handleAddTask} className="user-details-accept-button">Сохранить</button>
                </div>
            </div>
        </>
    )
}

export default CreateTask;