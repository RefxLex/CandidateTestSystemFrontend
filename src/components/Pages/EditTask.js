import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import baseURL from "../../api/baseUrl";
import "./EditTask.css";
import CustomRequest from "../../hooks/CustomRequest";
import HeaderWork from "../HeaderWork";
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';
import reject_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-20.png';


function EditTask(){

    const params = useParams();
    const navigate = useNavigate();
    const [inputModal, setInputModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState();
    const [levels, setLevels] = useState([]);
    const [topics, setTopics] = useState([]);
    const [newTaskInputArray, setNewTaskInputArray] = useState([]);
    const [taskInput, setTaskInput] = useState({
        id: "",
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

        const taskPromise = CustomRequest.doGet(baseURL + "/api/task/" + params.taskId);
        taskPromise.then( (data) => {
            setNewTask({
                name: data.name,
                topicId: data.topic.id,
                difficultyId: data.taskDifficulty.id,
                description: data.description
            })
            setNewTaskInputArray(data.taskTestInput);
        });

        const levelPromise = CustomRequest.doGet(baseURL + "/api/level/all");
        levelPromise.then( (data) => setLevels(data));
    
        const topicPromise = CustomRequest.doGet(baseURL + "/api/topic/all");
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

        //const taskPromise = CustomRequest.doPutWithBody(baseURL + "/api/task/" + params.taskId, body);
        //taskPromise.then( (data) => navigate("/tasks"));

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/task/" + params.taskId, {
            method:"PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((response) => {
            if (response.ok) {
                navigate("/tasks");
            }
            else{
                sessionStorage.setItem("status", response.status);
                sessionStorage.setItem("statusText", response.statusText);
                navigate("/error");
            }
        })
        .catch((error) => {
            sessionStorage.setItem("error", error);
            navigate("/error");
        });
    }

    function handleDeleteTask(event){
        event.preventDefault();

        //const taskPromise = CustomRequest.doPutEmpty(baseURL + "/api/task/delete/" + params.taskId);
        //taskPromise.then( () => navigate("/tasks"));

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/task/delete/" + params.taskId, {
            method:"PUT",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                navigate("/tasks");
            }
            else{
                sessionStorage.setItem("status", response.status);
                sessionStorage.setItem("statusText", response.statusText);
                navigate("/error");
            }
        })
        .catch((error) => {
            sessionStorage.setItem("error", error);
            navigate("/error");
        });
        
    }

    function handleEdit(event){
        const { id, value } = event.target;
        let testInput = newTaskInputArray.at(id);
        setEditId(id);
        setEditMode(true);
        setInputModal(!inputModal);
        setTaskInput({
            id: testInput.id,
            input: testInput.input,
            output: testInput.output
        });
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
                id:"",
                input: "",
                output: ""
            });
        }
        setInputModal(!inputModal);
    }

    function handleTestInputEdit(event){
        if( (taskInput.input!=="") && (taskInput.output!=="") )
        {
            let array = [...newTaskInputArray];
            array.at(editId).input = taskInput.input;
            array.at(editId).output = taskInput.output;
            setNewTaskInputArray(array);
            setTaskInput({
                id:"",
                input: "",
                output: ""
            });
        }
        setEditMode(false);
        setInputModal(!inputModal);
    }

    function handleCancel(event){
        event.preventDefault()
        setEditMode(false);
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

    return(
        <>
            <HeaderWork/>
            {/* Modal delete task*/}
            <>
                {deleteModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                <span>Вы точно хотите удалить задание?</span>
                            </div>
                            <form>
                                <div className="modal-btn-container">
                                    <button onClick={() => setDeleteModal(!deleteModal)} className="user-details-accept-button">Нет</button>
                                    <button onClick={handleDeleteTask} className="user-details-cancel-button">Да</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            {/* Add Test Input Modal */}
            {   inputModal && 
                            <>
                                 <div className="modal">
                                    <div className="overlay"></div>
                                    <div className="modal-content">
                                        <div className="task-modal-content-label">
                                        {
                                            editMode
                                                ? <span>Изменить тест</span>
                                                : <span>Новый тест</span>
                                        }
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
                                            <button onClick={handleCancel} className="user-details-cancel-button">Отмена</button>
                                            { editMode
                                                ? <button onClick={handleTestInputEdit} className="user-details-accept-button">Сохранить</button>
                                                : <button onClick={handleTestDataArray} className="user-details-accept-button">Добавить</button>
                                            }
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
                                                <img onClick={handleEdit} id={rowId} src={edit_icon} alt="edit" className="user-details-edit-icon"/>
                                                <img onClick={handleRemove} id={rowId} src={delete_icon} alt="edit" className="user-details-edit-icon"/>
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
                <div className="edit-task-btn-container">
                    <button onClick={() => setDeleteModal(!deleteModal)} className="user-details-cancel-button">
                        <img src={reject_icon}></img>
                        <span>Удалить задание</span>
                    </button>
                    <div>
                        <button onClick={handleAddTask} className="user-details-accept-button">Сохранить</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditTask;