import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StartTask.css";
import CustomRequest from "../../hooks/CustomRequest";
import baseURL from "../../api/baseUrl";
import back_icon from "../../images/icons8-back-arrow-30_2.png";
import launch_icon from '../../images/icons8-play-20.png';
import add_new_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-add-new-21.png';
import remove_icon from "../../images/icons8-minus-20_square.png";
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

function StartTask(){

    const [newSrcFileName, setNewSrcFileName] = useState("");
    const [newTestFileName, setNewTestFileName] = useState("");
    const [sourceCode, setSourceCode] = useState("");
    const [unitTestCode, setUnitTestCode] = useState("");
    const [activeSourceId, setActiveSourceId] = useState(0);
    const [activeUnitTestId, setActiveUnitTestId] = useState(0);
    const [userTask, setUserTask] = useState({});
    const [viewedBlock, setViewedBlock] = useState("instructions");
    const [completeModal, setCompleteModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [saved, setSaved] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [solution, setSolution] = useState([]);
    const [unitTests, setUnitTests] = useState([]);
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    let params = useParams();

    useEffect( () => {

        const userTaskPromise = CustomRequest.doGet(baseURL + "/api/user-task/" + params.userTaskId);
        userTaskPromise.then((data) => {
            setUserTask(data);
        });

    },[])

    function handleLaunch(){

        setProcessing(true);
        // save current editor
        const saveCurrent = new Promise((resolve, reject) => {
            let newSolution = [...solution];
            let newUnitTests = [...unitTests];
            newSolution.at(activeSourceId).code = sourceCode;
            newUnitTests.at(activeUnitTestId).code = unitTestCode;
            setSolution(newSolution);
            setUnitTests(newUnitTests);
            resolve();
        })
        saveCurrent.then(()=>{

            let solEncoded = [];
            let unitTestsEncoded = [];
            for (let i = 0; i < unitTests.length; i++) {
                let unitTest = {
                    code: btoa(unitTests[i].code)
                }
                unitTestsEncoded[i] = unitTest;
            }
            for (let j = 0; j < solution.length; j++) {
                let src = {
                    code: btoa(solution[j].code)
                }
                solEncoded[j] = src;
            }

            let body = {
                solution: solEncoded,
                unitTest: unitTestsEncoded,
            }

            sessionStorage.removeItem("status");
            sessionStorage.removeItem("statusText");
            sessionStorage.removeItem("error");
            fetch(baseURL + "/api/user-task/test-launch", {
                method:"POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            .then((response) => {
                if (response.ok) {
                    setProcessing(false);
                    return response.json();
                }
                else{
                    sessionStorage.setItem("status", response.status);
                    sessionStorage.setItem("statusText", response.statusText);
                    navigate("/error");
                }
            })
            .then((data) => {
                parseCompileResult(atob(data.result));
                setViewedBlock("result");
            })
            .catch((error) => {
                sessionStorage.setItem("error", error);
                navigate("/error");
            });
        });
    }

    function handleComplete(event){

        event.preventDefault();
        setCompleteModal(!completeModal);
        setSaveModal(!saveModal);

        let solEncoded = [];
        for (let i = 0; i < solution.length; i++) {
            let src = {
                code: btoa(solution[i].code)
            }
            solEncoded[i] = src;
        }
        let body = {
            solution: solEncoded
        }

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/user-task/complete/" + params.userTaskId, {
            method:"PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then((response) => {
            if (response.ok) {
                setSaved(true);
                return response.json();
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

    function handleRadio(event){
        setViewedBlock(event.target.value);
    }

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

    function addNewSourceFile(){
        setNewSrcFileName("");
        let newSrc = {
            name: newSrcFileName,
            code:"",
            selected: false
        }
        setSolution((prevArr) => [...prevArr, newSrc]);
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

    function removeSourceFile(){
        let newSolution = [...solution];
        newSolution.splice(activeSourceId, 1);
        setSolution(newSolution);
    }

    function removeUnitTest(){
        let newUnitTests = [...unitTests];
        newUnitTests.splice(activeUnitTestId, 1);
        setUnitTests(newUnitTests);
    }

    function activeSourceFile(event){
        const { id } = event.target;
        // save previous
        let newSolution = [...solution];
        newSolution.at(activeSourceId).code = sourceCode;
        newSolution.at(activeSourceId).selected = false;
        newSolution.at(id).selected = true;
        setSolution(newSolution);

        setActiveSourceId(id);
        let src = solution.at(id);
        setSourceCode(src.code);
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

    const onSolChange = React.useCallback((value, viewUpdate) => {
        setSourceCode(value);
    }, []);

    const onUnitTestChange = React.useCallback((value, viewUpdate) => {
        setUnitTestCode(value);
    }, []);

    function parseCompileResult(result){
        let lineIndex = 0;
        let text = result;
        let endLineSubstr="";
        let endLine = 0;
        let line = "";
        let lineArray = [];
        while(lineIndex != -1){
            lineIndex = text.indexOf("~");
            if(lineIndex != -1) {
                endLineSubstr = text.substring(lineIndex+1,text.lenght);
                //console.log("endLineSubstr" + "\n" + endLineSubstr);
                endLine = endLineSubstr.indexOf("~");
                //console.log("endLine" + endLine);
                if(endLine != -1){
                    line = text.substring(lineIndex, endLine+1);
                    line = '\n' + line;
                    console.log("line" + line);
                    lineArray.push(line);
                    text = text.substring(endLine+1, text.lenght);
                    //console.log("text" + "\n" + text);
                }
                else{
                    line = text.substring(lineIndex, text.lenght);
                    line = '\n' + line;
                    console.log("line" + line);
                    text = "";
                    lineArray.push(line);
                }
            }
        }
        setLogs([...lineArray]);
    }

    function closeSaveModal(){
        setSaveModal(!saveModal);
        navigate("/user");
    }

    return(

        <div className="user-task">
            {/* Modal complete task*/}
            <>
                {completeModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                <span>Вы точно хотите завершить задание?</span>
                            </div>
                            <form>
                                <div className="modal-btn-container">
                                    <button onClick={() => setCompleteModal(!completeModal)} className="user-details-cancel-button">Нет</button>
                                    <button onClick={handleComplete} className="user-details-accept-button">Да</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            {/* Modal save task*/}
            <>
                {saveModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                {   saved 
                                        ? <span>Готово</span>
                                        : <span>Сохранение...</span>
                                }
                            </div>
                            {   saved &&
                                    <form>
                                        <div className="start-task-modal-btn-container">
                                            <button onClick={closeSaveModal} 
                                            className="user-details-accept-button">Ок</button>
                                        </div>
                                    </form>
                            }
                        </div>
                    </div>
                }
            </>
            {/* Main content*/}
            <div className="solution-container">
                <div className="start-task-switch-bar">
                    <div className='start-task-radio'>
                        <input
                                className="radio__input" 
                                type="radio"
                                name="leftBlock"
                                id='radio_0'
                                value="code"
                                checked={viewedBlock==="code"}
                                onChange={handleRadio}
                        />
                        <label className='radio__label' htmlFor='radio_0'>Решение</label>
                        <input 
                                className="radio__input" 
                                type="radio" 
                                name="leftBlock"
                                id='radio_2'
                                value="instructions"
                                checked={viewedBlock==="instructions"}
                                onChange={handleRadio}
                        />
                        <label className='radio__label' htmlFor='radio_2'>Задание</label>
                        <input 
                                className="radio__input" 
                                type="radio" 
                                name="leftBlock"
                                id='radio_3'
                                value="result"
                                checked={viewedBlock==="result"}
                                onChange={handleRadio}
                        />
                        <label className='radio__label' htmlFor='radio_3'>Результат</label>
                    </div>
                    <div className="start-task-launch-btn-container">
                            <span>Запустить</span>
                            <button onClick={handleLaunch} className="start-task-accept-button">
                                <img src={launch_icon} alt="run"/>
                            </button>
                            { processing &&
                                <span className="start-task-test-launch-progress-label">Обработка...</span>
                            }
                    </div>
                    <div className="start-task-back-btn-container">
                        <button className="solution-back-btn" onClick={() => navigate(-1)}>Обратно
                            <img src={back_icon} alt="close"/>
                        </button>
                    </div>
                </div>
                { (viewedBlock==="code") &&
                    <>
                        <div className="start-task-ref-sol-container">
                            <div className="create-task-ref-sol-label-container">
                                <span>Решение</span>
                                <img className="create-task-icon" src={add_new_icon} onClick={addNewSourceFile}/>
                                <img className="create-task-icon" src={remove_icon} onClick={removeSourceFile}/>
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
                                    solution.map((sol, id)=>
                                        <span className={ (solution.at(id).selected) 
                                            ? "create-task-ref-sol-list-highlight" 
                                            : "create-task-ref-sol-list" }
                                            id={id} onClick={activeSourceFile}>{sol.name}
                                        </span>
                                    )
                                }
                            </div>
                            <div className="create-task-code-container">
                                <CodeMirror
                                    value={sourceCode}
                                    extensions={defineLanguage(userTask.task.languageName)}
                                    theme="light"
                                    onChange={onSolChange}
                                />
                            </div>
                        </div>
                        <div className="start-task-ref-sol-container">
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
                                    extensions={defineLanguage(userTask.task.languageName)}
                                    theme="light"
                                    onChange={onUnitTestChange}
                                />
                            </div>
                        </div>
                    </>

                }
                { (viewedBlock==="instructions") &&
                        <div className="user-task-instructions">
                            <ul>
                                <li className="user-task-instructions-name">{userTask.task?.name}</li>
                                <li>
                                    <label>Описание:</label>
                                    <p>{userTask.task?.description}</p>
                                </li>
                            </ul>
                            <div className="start-task-accept-button-container">
                                <button onClick={() => setCompleteModal(!completeModal)} className="user-task-accept-button">Завершить</button>
                            </div>
                        </div>
                }
                {   (viewedBlock==="result") &&
                        <div className="user-task-compile-container">
                            <div>
                                {
                                    logs.map( (line, id) =>
                                        <div key={id}>{line}</div>
                                    )
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default StartTask;