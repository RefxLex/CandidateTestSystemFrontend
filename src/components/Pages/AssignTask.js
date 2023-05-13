import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import baseURL from "../../api/baseUrl";
import HeaderWork from "../HeaderWork";
import Pagination from "../Pagination";
import "./AssignTask.css";
import CustomRequest from "../../hooks/CustomRequest";
import chevron_down from "/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-chevron-down-20.png";
import chevron_up from "/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-chevron-up-20.png";
import check_done from "/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-done-21.png";
import remove_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-minus-20.png';
import search_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-search-20.png';
import slide_up_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-slide-up-50.png';
import add_new_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-add-new-21.png';

function AssignTask(){

    let params = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [levels, setLevels] = useState([]);
    const [topics, setTopics] = useState([]);
    const [user, setUser] = useState({});
    const [languages, setLanguages] = useState([]);
    const [taskName, setTaskName] = useState("");
    const [levelId, setLevelId] = useState("");
    const [topicId, setTopicId] = useState("");
    const [defaultLanguageId, setDefaultLanguageId] = useState(63);
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [expandDescription, setExpandDescription] = useState(false);
    const [mappedTasks, setMappedTasks] = useState(new Map());
    const [mappedLang, setMappedLang] = useState(new Map());
    const [selectedArray, setSelectedArray] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [order, setOrder] = useState("ASC");
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = tasks.slice(indexOfFirstPost, indexOfLastPost);

    useEffect( () => {

        const userPromise = CustomRequest.doGet(baseURL + "/api/user/" + params.userId);
        userPromise.then( (data) => setUser(data));

        const taskPromise = CustomRequest.doGet(baseURL + "/api/task/filter?topic_id=" + "&level_id=" + "&name=");
        taskPromise.then( (data) => {
            let map = new Map();
            for (const iterator of data) {
                map.set(iterator.id,iterator);
            }
            setMappedTasks(map);
            setTasks(data);
        });

        const levelPromise = CustomRequest.doGet(baseURL + "/api/level/all");
        levelPromise.then( (data) => setLevels(data));

        const topicPromise = CustomRequest.doGet(baseURL + "/api/topic/all");
        topicPromise.then( (data) => setTopics(data));

        const languagePromise = CustomRequest.doGet(baseURL + "/api/exec-module/languages");
        languagePromise.then( (data) => {
            let languages = [];
            let map = new Map();
            for (const iterator of data) {
                if(iterator.is_archived == false){
                    languages.push(iterator);
                    map.set(iterator.id,iterator);
                }
            }
            setMappedLang(map);
            setLanguages(languages);
        })

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
        const taskPromise = CustomRequest.doGet(baseURL + 
            "/api/task/filter?topic_id=" + topicId + "&level_id=" + levelId + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
    }

    function handleInput(event){
        setTaskName(event.target.value);
    }

    function handleLevelSelect(event){
        setLevelId(event.target.value);
        const taskPromise = CustomRequest.doGet(baseURL +
             "/api/task/filter?topic_id=" + topicId + "&level_id=" + event.target.value + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
    }

    function handleTopicSelect(event){
        setTopicId(event.target.value);
        const taskPromise = CustomRequest.doGet(baseURL + 
            "/api/task/filter?topic_id=" + event.target.value + "&level_id=" + levelId + "&name=" + taskName);
        taskPromise.then( (data) => setTasks(data));
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
    }

    function handleAddTask(event){
        const { id } = event.target;

        let task = mappedTasks.get(parseInt(id));
        let newSelectedArray = [];
        for (let i = 0; i < selectedArray.length; i++) {
            newSelectedArray[i] = selectedArray[i];
        }

        let hasTask = false;
        for(let i=0; i<newSelectedArray.length; i++){
            if( (newSelectedArray[i].id == id)){
                hasTask = true
            }
        }

        if( hasTask == false ){

            task.languageId = defaultLanguageId;
            task.languageName = (mappedLang.get(parseInt(defaultLanguageId))).name;
            newSelectedArray.push(task);
            setSelectedArray(newSelectedArray);
        } else {
            //console.log("duplicate")
        }

    }

    function handleRemove(event){
        const { id } = event.target;
        let rowId = id
        let newSelectedArray = [];
        for(let i=0; i<selectedArray.length; i++){
            if(i != rowId){
                newSelectedArray.push(selectedArray[i]);
            }
        }
        setSelectedArray(newSelectedArray);
        //console.log(newSelectedArray);
    }

    function handleAssign(){
        
        let body = new Array(selectedArray.length);
        for(let i=0; i<selectedArray.length; i++){
            let task = {
                taskId: selectedArray[i].id,
                languageId: selectedArray[i].languageId,
                languageName: selectedArray[i].languageName
            };
            body[i] = task;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', baseURL + "/api/user-task/" + params.userId, true);
        xhr.timeout = 10000;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        xhr.send(JSON.stringify(body));
        xhr.onload = function() {
                if (xhr.status > 399) {
                    sessionStorage.setItem("status", xhr.status);
                    sessionStorage.setItem("statusText", xhr.statusText);
                    sessionStorage.removeItem("error");
                    navigate("/error");
                } else {
                    navigate(-2);
                }
          };
        xhr.onerror = function() {
            sessionStorage.removeItem("status");
            sessionStorage.removeItem("statusText");
            sessionStorage.setItem("error", "Network connection error");
            navigate("/error");
        }; 

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

    return(
        <div className="assign-task-container">
            <HeaderWork/>
            <div className="assign-task-top-block">
                <div className="assign-task-left-block">
                    <ul>
                        <li className="assign-task-user-name">{user.fullName}</li>
                        <li className="assign-task-user-info">{user.info}</li>
                    </ul>
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
                    <div className="assign-task-select-block">
                        <label htmlFor="topic">Раздел</label>
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
                    <div className="assign-task-label-language">
                        <label htmlFor="language">Язык</label>
                        <select className="assign-task-select"
                            id="language"
                            value={defaultLanguageId}
                            onChange={(event) => setDefaultLanguageId(event.target.value)}
                            name="language"
                        >
                            {
                                languages.map( (language, rowId) =>
                                    <option key={rowId} value={language.id}>{language.name}</option>
                                )
                            }   
                        </select>
                    </div>
                </div>
                <div className="assign-task-right-block">
                    <div className="assign-task-right-block-label">
                        <label>Выбранные задания</label>
                    </div>
                    <ul className="assign-task-selected-list">
                        
                            <table className="assign-task-table">
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Язык</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedArray.map( (task, rowId) => 
                                            <tr key={rowId}>
                                                <td className="assign-task-table-column">{task.name}</td>
                                                <td className="assign-task-table-column">{task.languageName}
                                                </td>
                                                <td className="assign-task-table-column">
                                                    <img id={rowId} src={remove_icon} alt="add" onClick={handleRemove} className="assing-task-add-icon"/>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>    
                    </ul>
                    <div className="assing-task-buttons-container">
                        <button onClick={handleAssign} className="user-details-accept-button">Назначить</button>
                    </div>
                </div>
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
                                    <img id={task.id} src={add_new_icon} alt="add" onClick={handleAddTask} className="assing-task-add-icon"/>
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
            { backToTopButton && (<img  className="to-top" onClick={scrollUp} src={slide_up_icon} alt="scrollUp"/>)}
        </div>
    )
}

export default AssignTask;