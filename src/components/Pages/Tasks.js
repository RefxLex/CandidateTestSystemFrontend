import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderWork from "../HeaderWork";
import Pagination from "../Pagination";
import baseURL from "../../api/util";
import "./Tasks.css";
import search_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-search-20.png';
import chevron_down from "/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-chevron-down-20.png";
import chevron_up from "/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-chevron-up-20.png";
import slide_up_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-slide-up-50.png';
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';



function Task(){

    //const [viewedBlock, setViewedBlock] = useState("tasks");
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [levels, setLevels] = useState([]);
    const [topics, setTopics] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [levelId, setLevelId] = useState("");
    const [topicId, setTopicId] = useState("");
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [expandDescription, setExpandDescription] = useState(false);

    const [taskModal, setTaskModal] = useState(false);
    const [inputModal, setInputModal] = useState(false);
    const [newTaskInputArray, setNewTaskInputArray] = useState([]);
    const [taskInput, setTaskInput] = useState({
        input: "",
        output: ""
    });
    const [newTask, setNewTask] = useState({
        name: "",
        topicId: 9,
        difficultyId: 4,
        description: ""
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [order, setOrder] = useState("ASC");
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = tasks.slice(indexOfFirstPost, indexOfLastPost);

    useEffect( () => {

        const taskPromise = doGet("/api/task/filter?topic_id=" + "&level_id=" + "&name=");
        taskPromise.then( (data) => setTasks(data));
    
        const levelPromise = doGet("/api/task/difficulty");
        levelPromise.then( (data) => setLevels(data));
    
        const topicPromise = doGet("/api/topic/all");
        topicPromise.then( (data) => setTopics(data));

        window.addEventListener("scroll", () => {
            if(window.scrollY > 100){
                setBackToTopButton(true);
            }else{
                setBackToTopButton(false);
            }
        })

    },[])

    function handleSearch(event){
        event.preventDefault();
        const taskPromise = doGet("/api/task/filter?topic_id=" + topicId + "&level_id=" + levelId + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
    }

    function handleInput(event){
        setTaskName(event.target.value);
    }

    function handleLevelSelect(event){
        setLevelId(event.target.value);
        const taskPromise = doGet("/api/task/filter?topic_id=" + topicId + "&level_id=" + event.target.value + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
    }

    function handleTopicSelect(event){
        setTopicId(event.target.value);
        const taskPromise = doGet("/api/task/filter?topic_id=" + event.target.value + "&level_id=" + levelId + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
    }

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
        taskPromise.then( (data) => setTasks( (prevArr) => [...prevArr,data]));
        setNewTaskInputArray([]);
        setNewTask({
            name: "",
            topicId: 9,
            difficultyId: 4,
            description: ""
        })
        setInputModal(false);
        console.log(body);
    }


    /*
    function handleDelete(event){
        const { id } = event.target;
        const taskPromise = doPut("/api/task/delete/" + id);
        taskPromise.then( () => location.reload());
    } */

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

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "auto"
        })
    }

    function expand(){
        setExpandDescription(!expandDescription);
        console.log(selectedArray);
        console.log(newTaskInputArray);
    }

    /*
    function handleRadio(event){
        if( (event.target.value==="comment")){
            setComment(userTask.comment);
        }
        setViewedBlock(event.target.value);
    } */

    function nextModal(event){
        event.preventDefault();
        setTaskModal(!taskModal);
        setInputModal(!inputModal);
    }

    function handleBack(event){
        event.preventDefault();
        setTaskModal(!taskModal);
        setInputModal(!inputModal);
        setNewTaskInputArray([]);
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
    }

    function handleCancel(event){
        event.preventDefault()
        setNewTask({
            name: "",
            topicId: 9,
            difficultyId: 4,
            description: ""
        })
        setTaskModal(!taskModal);
    }

    const sorting = (col) => {

        switch (col) {
            case "topic":
                if(order==="ASC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a.topic["name"] > b.topic["name"] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("DSC");
                }
                if(order==="DSC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a.topic["name"] < b.topic["name"] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("ASC");
                }
                break;
            case "taskDifficulty":
                if(order==="ASC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a.taskDifficulty["name"] > b.taskDifficulty["name"] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("DSC");
                }
                if(order==="DSC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a.taskDifficulty["name"] < b.taskDifficulty["name"] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("ASC");
                }
                break;
            default:
                if(order==="ASC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a[col] > b[col] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("DSC");
                }
                if(order==="DSC"){
                    const sorted = [...tasks].sort( (a,b) =>
                        a[col] < b[col] ? 1 : -1
                    );
                    setTasks(sorted)
                    setOrder("ASC");
                }
                break;
        }
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    async function doPut(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
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

        <div className="task-container">
            <HeaderWork/>
            {/*<div className='task-radio'>
                    <input
                            className="radio__input" 
                            type="radio"
                            name="leftBlock"
                            id='radio_0'
                            value="tasks"
                            checked={viewedBlock==="tasks"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_0'>Задания</label>
                    <input 
                            className="radio__input" 
                            type="radio" 
                            name="leftBlock"
                            id='radio_1'
                            value="topics"
                            checked={viewedBlock==="topics"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_1'>Разделы</label>
                    <input 
                            className="radio__input" 
                            type="radio" 
                            name="leftBlock"
                            id='radio_2'
                            value="levels"
                            checked={viewedBlock==="levels"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_2'>Сложность</label>
                </div> */}

                <>
                    {/* Add task modal */}
                    {   taskModal &&
                                <div className="modal">
                                    <div className="overlay"></div>
                                    <div className="task-modal-content">
                                        <div className="task-modal-content-label">
                                            <span>Новое задание</span>
                                        </div>
                                        <form onSubmit={ (e) => e.preventDefault()}>
                                            <div className="modal-txt-field">
                                                <label htmlFor="fullName">Название</label>
                                                <input
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
                                            <div className="modal-btn-container">
                                                <button onClick={handleCancel} className="user-details-cancel-button">Отмена</button>
                                                <button onClick={nextModal} className="user-details-accept-button">Далее</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                    }
                    {/* Add Test Input Modal */}
                    {   inputModal && 
                            <>
                                 <div className="modal">
                                    <div className="overlay"></div>
                                    <div className="modal-content">
                                        <div className="task-modal-content-label">
                                            <span>Новое задание</span>
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
                                        <span>Всего {newTaskInputArray.length}</span>
                                        <button onClick={handleTestDataArray} className="user-details-cancel-button">Добавить тест 
                                        </button>
                                        <div className="modal-btn-container">
                                            <button onClick={handleBack} className="user-details-cancel-button">Назад</button>
                                            <button onClick={handleAddTask} className="user-details-accept-button">Сохранить</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                    {/* Main content */}
                    <div className="admin_page_search_container">
                                <form onSubmit={handleSearch} className='admin_page_search_bar'>
                                            <img src={search_icon}></img>
                                            <input 
                                                type="text"
                                                name="search"
                                                placeholder='Поиск задания'
                                                value={taskName}
                                                onInput={handleInput}
                                            />
                                </form>
                    </div>
                    <div className="task-select-block">
                        <div className="task-select-label">
                            <label htmlFor="topic">Раздел</label>
                        </div>
                        <select className="assign-task-select"
                            id="topic"
                            value={topicId}
                            onChange={handleTopicSelect}
                            name="topic"
                        >
                            <option value="">Все</option>
                            {
                                topics.map( (topic, rowId) =>
                                    <option key={rowId} value={topic.id}>{topic.name}</option>
                                )
                            }
                        </select>
                        <label htmlFor="level">Сложность</label>
                        <select className="assign-task-select"
                            id="level"
                            value={levelId}
                            onChange={handleLevelSelect}
                            name="level"
                        >
                            <option value="">Любая</option>
                            {
                                levels.map( (level, rowId) =>
                                    <option key={rowId} value={level.id}>{level.name}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className='task_invite_button_container'>
                        <button onClick={() => setTaskModal(!taskModal)} className="user-details-accept-button">Добавить задание</button>
                    </div>
                    <table className="assign-task-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th onClick={() => sorting("name")}>Название</th>
                                <th onClick={() => sorting("topic")}>Раздел</th>
                                <th onClick={() => sorting("taskDifficulty")}>Сложность</th>
                                <th>Описание</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentPosts.map( (task, rowId) =>
                                    <tr key={rowId}>
                                        <td>
                                            <div className="task-task-item-btns">
                                                <img id={task.id} onClick={(event) => navigate("/task/edit/" + event.target.id)} 
                                                    src={edit_icon} alt="edit" className="user-details-edit-icon"/>
                                                {/*<img id={task.id} onClick={handleDelete} src={delete_icon} alt="delete" className="user-details-edit-icon"/>*/}
                                            </div>
                                        </td>
                                        <td className="assign-task-table-column">{task.name}</td>
                                        <td className="assign-task-table-column">{task.topic.name}</td>
                                        <td className="assign-task-table-column">{task.taskDifficulty.name}</td>
                                        <td className="assign-task-table-description">
                                            {   expandDescription 
                                                    ?   <>
                                                            <p>{task.description}</p>
                                                            <img onClick={expand} className="user-details-edit-icon" src={chevron_up} alt="expand"/>
                                                        </>
                                                    :  <img onClick={expand} className="user-details-edit-icon" src={chevron_down} alt="expand"/>
                                            }
                                        </td>
                                    </tr>
                                    )
                            }
                        </tbody>
                    </table>
                    <div className="assign-task-pagination">
                        <Pagination postsPerPage={postsPerPage} totalPosts={tasks.length} paginate={paginate} />
                    </div>
                </>
            
            { backToTopButton && (<img  className="to-top" onClick={scrollUp} src={slide_up_icon} alt="scrollUp"/>)}
        </div>
    )
}

export default Task;