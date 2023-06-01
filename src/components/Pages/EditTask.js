import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import baseURL from "../../api/baseUrl";
import "./EditTask.css";
import CustomRequest from "../../hooks/CustomRequest";
import HeaderWork from "../HeaderWork";
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';
import reject_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-20.png';
import add_new_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-add-new-21.png';
import remove_icon from "../../images/icons8-minus-20_square.png";
import lock_icon from "../../images/icons8-lock-20.png";
import lock_unlocked_icon from "../../images/icons8-open-lock-20.png";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';


function EditTask(){

    const params = useParams();
    const navigate = useNavigate();
    const [newSrcFileName, setNewSrcFileName] = useState("");
    const [newTestFileName, setNewTestFileName] = useState("");
    const [refSolCode, setRefSolCode] = useState("");
    const [unitTestCode, setUnitTestCode] = useState("");
    const [activeRefSolId, setActiveRefSolId] = useState(0);
    const [activeUnitTestId, setActiveUnitTestId] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [topics, setTopics] = useState([]);
    const [unitTests, setUnitTests] = useState([]);
    const [refSolution, setRefSolution] = useState([]);
    const [newTask, setNewTask] = useState({
        name: "",
        topicId: 1,
        difficultyId: 1,
        description: "",
        languageName:""
    })

    useEffect (() => {

        const taskPromise = CustomRequest.doGet(baseURL + "/api/task/" + params.taskId);
        taskPromise.then( (data) => {
            setNewTask({
                name: data.name,
                topicId: data.topic.id,
                difficultyId: data.taskDifficulty.id,
                description: data.description,
                languageName: data.languageName
            })
            for (let i = 0; i < data.refSolution.length; i++) {
                let src = {
                    name: i,
                    code: atob(data.refSolution[i].code),
                    selected: (i==0) ? true : false
                }
                refSolution[i] = src;
            }
            for (let j = 0; j < data.unitTest.length; j++) {
                let unitTest = {
                    name: j,
                    code: atob(data.unitTest[j].code),
                    selected: (j==0) ? true : false
                }
                unitTests[j] = unitTest;  
            }
            setRefSolCode(atob(data.refSolution.at(0).code));
            setUnitTestCode(atob(data.unitTest.at(0).code));
        });

        const levelPromise = CustomRequest.doGet(baseURL + "/api/level/all");
        levelPromise.then( (data) => setLevels(data));
    
        const topicPromise = CustomRequest.doGet(baseURL + "/api/topic/all");
        topicPromise.then( (data) => setTopics(data));

        const languagePromise = CustomRequest.doGet(baseURL + "/api/task/languages");
        languagePromise.then( (data) => setLanguages(data));

    },[])

    
    function handleAddTask(event){
        event.preventDefault();
        // save current editor
        const saveCurrent = new Promise((resolve, reject) => {
            let newRefSol = [...refSolution];
            let newUnitTests = [...unitTests];
            newRefSol.at(activeRefSolId).code = refSolCode;
            newUnitTests.at(activeUnitTestId).code = unitTestCode;
            setRefSolution(newRefSol);
            setUnitTests(newUnitTests);
            resolve();
        })
        saveCurrent.then(()=>{
            let refSolEncoded = [];
            let unitTestsEncoded = [];
            for (let i = 0; i < unitTests.length; i++) {
                let unitTest = {
                    code: btoa(unitTests[i].code)
                }
                unitTestsEncoded[i] = unitTest;
            }
            for (let j = 0; j < refSolution.length; j++) {
                let src = {
                    code: btoa(refSolution[j].code)
                }
                refSolEncoded[j] = src;
            }

            let body = {
                name: newTask.name,
                topicId: newTask.topicId,
                difficultyId: newTask.difficultyId,
                description: newTask.description,
                languageName: newTask.languageName,
                unitTest: unitTestsEncoded,
                refSolution: refSolEncoded,
            }

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
        })
    }

    function addNewRefSol(){
        setNewSrcFileName("");
        let newSrc = {
            name: newSrcFileName,
            code:"",
            selected: false
        }
        setRefSolution((prevArr) => [...prevArr, newSrc]);
    }

    function addNewUnitTest(){
        setNewTestFileName("");
        let newUnitTest = {
            name: newTestFileName,
            code:"",
            selected: false
        }
        setUnitTests((prevArr) => [...prevArr, newUnitTest]);
    }

    function removeRefSol(){
        let newRefSol = [...refSolution];
        newRefSol.splice(activeRefSolId, 1);
        setRefSolution(newRefSol);
    }

    function removeUnitTest(){
        let newUnitTests = [...unitTests];
        newUnitTests.splice(activeUnitTestId, 1);
        setUnitTests(newUnitTests);
    }

    function onTaskChange(event){
        const { value, name } = event.target;
        setNewTask( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
    }

    function activeRefSol(event){
        const { id } = event.target;
        // save previous
        let newRefSol = [...refSolution];
        newRefSol.at(activeRefSolId).code = refSolCode;
        newRefSol.at(activeRefSolId).selected = false;
        newRefSol.at(id).selected = true;
        setRefSolution(newRefSol);

        setActiveRefSolId(id);
        let solution = refSolution.at(id);
        setRefSolCode(solution.code);
    }

    function activeUnitTest(event){
        const { id } = event.target;
        // save previous
        let newUnitTests = [...unitTests];
        newUnitTests.at(activeUnitTestId).code = unitTestCode;
        newUnitTests.at(activeUnitTestId).selected = false;
        newUnitTests.at(id).selected = true;
        setUnitTests(newUnitTests);

        setActiveUnitTestId(id);
        let unitTest = unitTests.at(id);
        setUnitTestCode(unitTest.code);
    }

    const onRefSolChange = React.useCallback((value, viewUpdate) => {
        setRefSolCode(value);
    }, []);

    const onUnitTestChange = React.useCallback((value, viewUpdate) => {
        setUnitTestCode(value);
    }, []);

    function defineLanguage(languageName){
        switch (languageName) {
            case "Java":
                return ([java()])
            case "JavaScript":
                return ([javascript()])
            case "C++":
                return ([cpp()])
            case "C":
                return ([cpp()])
            case "C#":
                return ([cpp()])
            case "PHP":
                return ([php()])
            case "Python":
                return ([python()])
            case "Rust":
                return ([rust()])
            case "SQL":
                return ([sql()])            
            default:
                return ([markdown({ base: markdownLanguage, codeLanguages: languages })])
        }
    }

    return(
        <>
            <HeaderWork/>
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
                    <div className="assign-task-label-language">
                        <label htmlFor="languageName">Язык</label>
                        <select className="assign-task-select"
                            id="languageName"
                            value={newTask.languageName}
                            onChange={onTaskChange}
                            name="languageName"
                        >
                            {
                                languages.map( (language, rowId) =>
                                    <option key={rowId} value={language}>{language}</option>
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
                <div className="create-task-ref-sol-container">
                    <div className="create-task-ref-sol-label-container">
                        <span>Решение</span>
                        <img className="create-task-icon" src={add_new_icon} onClick={addNewRefSol}></img>
                        <img className="create-task-icon" src={remove_icon} onClick={removeRefSol}/>
                        <input
                            id="taskInput"
                            className="start-task-modal-input"
                            name="input"
                            onChange={()=>setNewSrcFileName(event.target.value)}
                            value={newSrcFileName}
                        />
                    </div>
                    <div className="create-task-file-panel">
                        {
                            refSolution.map((sol, id)=>
                                <span className={ (refSolution.at(id).selected) 
                                    ? "create-task-ref-sol-list-highlight" 
                                    : "create-task-ref-sol-list" }
                                    id={id} onClick={activeRefSol}>{sol.name}
                                </span>
                            )
                        }
                    </div>
                    <div className="create-task-code-container">
                        <CodeMirror
                            value={refSolCode}
                            extensions={defineLanguage(newTask.languageName)}
                            theme="light"
                            onChange={onRefSolChange}
                        />
                    </div>
                </div>
                <div className="create-task-ref-sol-container">
                    <div className="create-task-ref-sol-label-container">
                        <span>Тесты</span>
                        <img className="create-task-icon" src={add_new_icon} onClick={addNewUnitTest}/>
                        <img className="create-task-icon" src={remove_icon} onClick={removeUnitTest}/>
                        <input
                            id="taskInput"
                            className="start-task-modal-input"
                            name="input"
                            onChange={()=>setNewTestFileName(event.target.value)}
                            value={newTestFileName}
                        />
                    </div>
                    <div className="create-task-file-panel">
                        {
                            unitTests.map((test, id)=>
                                <span className={ (unitTests.at(id).selected) 
                                    ? "create-task-ref-sol-list-highlight" 
                                    : "create-task-ref-sol-list" }
                                    id={id} onClick={activeUnitTest}>{test.name}
                                </span>
                            )
                        }
                    </div>
                    <div className="create-task-code-container">
                        <CodeMirror
                            value={unitTestCode}
                            extensions={defineLanguage(newTask.languageName)}
                            theme="light"
                            onChange={onUnitTestChange}
                        />
                    </div>
                </div>         
                <div className="modal-btn-container">
                    <button onClick={handleAddTask} className="user-details-accept-button">Сохранить</button>
                </div>
            </div>
        </>
    )
    
}

export default EditTask;