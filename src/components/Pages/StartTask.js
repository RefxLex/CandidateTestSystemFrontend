import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StartTask.css";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import execModuleUrl from "../../api/execModuleUrl";
import back_icon from "../../images/icons8-back-arrow-30_2.png";
import launch_icon from '../../images/icons8-play-20.png';
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

    const [userTask, setUserTask] = useState({});
    const [launchResults, setLaunchResults] = useState([]);
    const [viewedBlock, setViewedBlock] = useState("instructions");
    const [completeModal, setCompleteModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [saved, setSaved] = useState(false);
    const [lowerPanel, setLowerPanel] = useState("log");
    const [codeLanguage, setCodeLanguage] = useState([]);
    const [code, setCode] = useState("");
    const [testInput, setTestInput] = useState("");
    const [logs, setLogs] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    let params = useParams();

    useEffect( () => {

        
        const userTaskPromise = doGet("/api/user-task/" + params.userTaskId);
        userTaskPromise.then((data) => {
            setUserTask(data);
            setCodeLanguage(defineLanguage(data.taskCodeLanguageId));
        });

    },[])

    function handleLaunch(){
        let timeStamp = getTimeStamp();
        setLogs((prevArr) => [...prevArr, {date: timeStamp, message: "Loading...",}]);
        let codeEncoded = btoa(code);
        let input = null;
        if(testInput!==""){
            input = btoa(testInput);
        }
        let body = {
            source_code: codeEncoded,
            language_id: userTask.taskCodeLanguageId,
            stdin: input
        }
        const tokenPromise = createSubmission(execModuleUrl, "/submissions/?base64_encoded=true&wait=false", body);
        tokenPromise.then( (data) => {
            subscribeTest(data.token);
        })
    }

    function handleComplete(event){
        event.preventDefault();
        setCompleteModal(!completeModal);
        setSaveModal(!saveModal);
        let codeEncoded = btoa(code);
        let body = {
            code: codeEncoded
        }
        const tokenPromise = doPut("/api/exec-module/submission/" + params.userTaskId, body);
        tokenPromise.then((data) => {
            let requests = [];
            data.map(obj => 
                {
                    let subPromise = subscribeSave(obj.token);
                    requests.push(subPromise);
                });
            Promise.all(requests)
            .then(() => {
                const savePromise = saveSubmission("/api/exec-module/submission/result/" + params.userTaskId);
                savePromise.then(() => setSaved(true));
            });
        })
    }

    function handleRadio(event){
        setViewedBlock(event.target.value);
    }

    function lowerPanelRadio(event){
        setLowerPanel(event.target.value);
    }

    const onChange = React.useCallback((value, viewUpdate) => {
        setCode(value);
    }, []);

    function getTimeStamp() {
        var now = new Date();
        return ((now.getMonth() + 1) + '/' +
                (now.getDate()) + '/' +
                 now.getFullYear() + " " +
                 now.getHours() + ':' +
                 ((now.getMinutes() < 10)
                     ? ("0" + now.getMinutes())
                     : (now.getMinutes())) + ':' +
                 ((now.getSeconds() < 10)
                     ? ("0" + now.getSeconds())
                     : (now.getSeconds())));
    }

    function defineLanguage(languageId){
        let l = languageId;
        if(l==62){
            return ([java()]);  
        }else if(l==63){
            return ([javascript()]);
        }else if( (l==75) || (l==76) || ((l>=48) && (l<=54)) ){
            return ([cpp()]);
        }else if(l==68){
            return ([php()]);
        }else if( (l==70) || (l==71) ){
            return ([python()]);
        }else if(l==73){
            return ([rust()]);
        }else if(l==82){
            return ([sql()]); 
        }else{
            return ([markdown({ base: markdownLanguage, codeLanguages: languages })]);
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

    async function saveSubmission(resourceURL){
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

    async function subscribeTest(token) {
        let response = await fetch(execModuleUrl + "/submissions/" + token,{
            method:"GET",
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const result = await response.json();
        if(result.status.id < 3) {

            let timeStamp = getTimeStamp();
            setLogs((prevArr) => [...prevArr, {date: timeStamp, message: "Status: " + result.status.description,}]);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await subscribeTest(token);
        }else {
                setLaunchResults((prevArr) => [...prevArr, result]);
                let timeStamp = getTimeStamp();
                setLogs((prevArr) => [...prevArr, {date: timeStamp, message: "Status: " + result.status.description,}]);
                let output = result.compile_output;
                if((output!==null) && (output!==undefined) && (output!=="")){
                    setLogs((prevArr) => [...prevArr, {date: timeStamp, message: output,}]);
                }
                if((result.stderr!==null) && (result.stderr!==undefined) && (result.stderr!=="")){
                    setLogs((prevArr) => [...prevArr, {date: timeStamp, message: result.stderr,}]);
                }
                if((result.stdout!==null) && (result.stdout!==undefined) && (result.stdout!=="")){
                    setLogs((prevArr) => [...prevArr, {date: timeStamp, message: result.stdout,}]);
                }
                return result;
        }
    }

    async function subscribeSave(token) {
        let response = await fetch(execModuleUrl + "/submissions/" + token,{
            method:"GET",
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const result = await response.json();
        if(result.status.id < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await subscribeSave(token);
        }else {
            return result;
        }
    }
      
    async function createSubmission(serverUrl, resourceURL, body){
        try{
            const response = await fetch (serverUrl + resourceURL, {
                method:"POST",
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
                                        ?<span>Готово</span>
                                        :<span>Сохранение...</span>
                                }
                            </div>
                            {   saved &&
                                    <form>
                                        <div className="start-task-modal-btn-container">
                                            <button onClick={() => {setSaveModal(!saveModal); navigate("/user")}} 
                                            className="user-details-accept-button">Ок</button>
                                        </div>
                                    </form>
                            }
                        </div>
                    </div>
                }
            </>
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
                        </div>
                    <div className="start-task-back-btn-container">
                        <button className="solution-back-btn" onClick={() => navigate(-1)}>Обратно
                            <img src={back_icon} alt="close"/>
                        </button>
                    </div>
                </div>
                { (viewedBlock==="code") &&
                    <>
                        <div className="user-details-code-container">
                            <CodeMirror
                                value={code}
                                extensions={codeLanguage}
                                theme="light"
                                onChange={onChange}
                                height="70vh"
                                width="98vw"
                            />
                        </div>
                        <div className="start-task-console-container">
                            <div className='start-task-radio'>
                                <input
                                        className="radio__input" 
                                        type="radio"
                                        name="lowerBar"
                                        id='lowerBarR0'
                                        value="log"
                                        checked={lowerPanel==="log"}
                                        onChange={lowerPanelRadio}
                                />
                                <label className='start-task-lower-panel-input-label' htmlFor='lowerBarR0'>Консоль</label>
                                <input 
                                        className="radio__input" 
                                        type="radio" 
                                        name="lowerBar"
                                        id='lowerBarR1'
                                        value="input"
                                        checked={lowerPanel==="input"}
                                        onChange={lowerPanelRadio}
                                />
                                <label className='start-task-lower-panel-input-label' htmlFor='lowerBarR1'>Ввод</label>
                            </div>
                            {   (lowerPanel==="log") &&
                                    <div className="start-task-console">
                                        {
                                            logs.map( (log, itemId) =>
                                                <div key={itemId}>
                                                    <span>{log.date}</span>
                                                    <span> --- </span>
                                                    <span>{log.message}</span>                                                  
                                                </div>
                                            )
                                        }
                                    </div>
                            }
                            {   (lowerPanel==="input") &&
                                    <div>
                                        <textarea
                                            className="start-task-test-input"
                                            name="testInout"
                                            onChange={(event) => setTestInput(event.target.value)}
                                            value={testInput}
                                        />
                                    </div>

                            }
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
                        <table className="user-details-table">
                            <thead>
                                <tr>
                                    <th>Номер</th>
                                    <th>Статус</th>
                                    <th>Время(s)</th>
                                    <th>Память(Kb)</th>
                                    <th>Ввод</th>
                                    <th>Вывод</th>
                                    <th>Exit code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    launchResults.map( (result, blockId) =>
                                        <tr key={blockId}>
                                            <td>{blockId}</td>
                                            <td>{result.status.description}</td>
                                            <td>{result.time}</td>
                                            <td>{result.memory}</td>
                                            <td>{testInput}</td>
                                            <td>{result.stdout}</td>
                                            <td>{result.exit_code}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                    </table>

                }
            </div>
        </div>
    )
}

export default StartTask;