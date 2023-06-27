import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserTask.css";
import CustomRequest from "../../hooks/CustomRequest";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import sonarURL from "../../api/sonarUrl";
import back_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-back-arrow-30_2.png';
import slide_up_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-slide-up-50.png';
import reject_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-20.png';
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


function UserTask() {

    const [progressModal, setProgressModal] = useState(false);
    const [saved, setSaved] = useState(false);
    const [userTask, setUserTask] = useState({});
    const [user, setUser] = useState({});
    const [viewedBlock, setViewedBlock] = useState("code");
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [modal, setModal] = useState(false);
    const [comment, setComment] = useState("");
    const [solution, setSolution] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [testReport, setTestReport] = useState([]);
    const navigate = useNavigate();
    let params = useParams();

    useEffect( () => {

        const userTaskPromise = CustomRequest.doGet(baseURL + "/api/user-task/find-one/" + params.userTaskId);
        userTaskPromise.then((data) => {
            setUserTask(data);
            setSolution(data.userTaskSolution);
            parseCompileResult(atob(data.resultReport));
            setComment(data.comment);
            //console.log(data);
        });

        const userPromise = CustomRequest.doGet(baseURL + "/api/user/by-user-task/" + params.userTaskId);
        userPromise.then( (data) => {
            setUser(data);
        })

        window.addEventListener("scroll", () => {
            if(window.scrollY > 100){
                setBackToTopButton(true);
            }else{
                setBackToTopButton(false);
            }
        })

    },[])

    function handleRadio(event){
        if( (event.target.value==="comment")){
            setComment(userTask.comment);
        }
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

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "auto"
        })
    }

    function expand(event){
        setModal(!modal)
    }

    function onChange(event){
        setComment(event.target.value);
    }

    function handleSave(){
        const updatePromise = CustomRequest.doPostWithBody(baseURL + "/api/user-task/" + params.userTaskId, {
            comment: comment
        })
        updatePromise.then( () => location.reload() );
    }

    function handleDelete(event){
        event.preventDefault();

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/user-task/" + params.userTaskId, {
            method:"DELETE",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                navigate(-1);
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

    function handleSonarAnalysis(){
        setProgressModal(!progressModal);
        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/metrics/run?id=" + params.userTaskId, {
            method:"PUT",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                setSaved(true);
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
                    line = text.substring(lineIndex, endLine);
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
        setTestReport(lineArray);
    }
    

    return(

        <div className="user-task">
            <HeaderWork/>
            {/* Progress modal */}
            {progressModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                {   saved 
                                        ?<span>Готово</span>
                                        :<span>Выполнение анализа...</span>
                                }
                            </div>
                            {   saved &&
                                    <form>
                                        <div className="start-task-modal-btn-container">
                                            <button onClick={() => {setProgressModal(!progressModal);location.reload();}}
                                            className="user-details-accept-button">Ок</button>
                                        </div>
                                    </form>
                            }
                        </div>
                    </div>
            }
            {/* Modal delete user task*/}
            <>
                {deleteModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                <span>Вы точно хотите отменить задание?</span>
                            </div>
                            <form>
                                <div className="modal-btn-container">
                                    <button onClick={() => setDeleteModal(!deleteModal)} className="user-details-accept-button">Нет</button>
                                    <button onClick={handleDelete} className="user-details-cancel-button">Да</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            <div className="solution-header">
                <span>{user.fullName}</span>
                <span>Решение задачи {userTask.task?.name}</span>
                <button className="solution-back-btn" onClick={() => navigate(-1)}>Обратно
                    <img src={back_icon} alt="close"/>
                </button>
            </div>
            <div className="solution-container">
                <div className='solution-radio'>
                    <input
                            className="radio__input" 
                            type="radio"
                            name="leftBlock"
                            id='radio_0'
                            value="code"
                            checked={viewedBlock==="code"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_0'>Код решения</label>
                    <input
                            className="radio__input" 
                            type="radio"
                            name="leftBlock"
                            id='radio_5'
                            value="refSol"
                            checked={viewedBlock==="refSol"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_5'>Образец</label>
                    <input 
                            className="radio__input" 
                            type="radio" 
                            name="leftBlock"
                            id='radio_1'
                            value="tests"
                            checked={viewedBlock==="tests"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_1'>Тесты</label>
                    <input 
                            className="radio__input" 
                            type="radio" 
                            name="leftBlock"
                            id='radio_6'
                            value="compile"
                            checked={viewedBlock==="compile"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_6'>Компиляция</label>
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
                            value="comment"
                            checked={viewedBlock==="comment"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_3'>Комментарий</label>
                    <input
                            className="radio__input" 
                            type="radio"
                            name="leftBlock"
                            id='radio_4'
                            value="metrics"
                            checked={viewedBlock==="metrics"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_4'>Метрики</label>
                </div>
                { (viewedBlock==="code") &&

                        solution.map((sol, id) =>
                            <div key={id} className="user-details-code-container">
                                <CodeMirror
                                    value={atob(sol.code)}
                                    extensions={defineLanguage(userTask.task.languageName)}
                                    theme="light"
                                    readOnly={true}
                                />
                            </div>
                        )
                }
                { (viewedBlock==="refSol") &&

                        userTask.task.refSolution.map((sol, id) =>
                            <div key={id} className="user-details-code-container">
                                <CodeMirror
                                    value={atob(sol.code)}
                                    extensions={defineLanguage(userTask.task.languageName)}
                                    theme="light"
                                    readOnly={true}
                                />
                            </div>
                        )
                }
                { (viewedBlock==="tests") &&

                        userTask.task.unitTest.map((sol, id) =>
                        <div key={id} className="user-details-code-container">
                            <CodeMirror
                                value={atob(sol.code)}
                                extensions={defineLanguage(userTask.task.languageName)}
                                theme="light"
                                readOnly={true}
                            />
                        </div>
                    )
                }
                {
                    (viewedBlock==="compile") &&
                    <div className="user-task-compile-container">
                        <div className={
                            userTask.compilationResult==="OK" ? "user-task-compile-green" : "user-task-compile-red"
                        }>{userTask.compilationResult}</div>
                        <div>
                            {
                                testReport.map( (line, id) =>
                                    <div key={id}>{line}</div>
                                )
                            }
                        </div>
                    </div>
                }
                { (viewedBlock==="instructions") &&
                        <div className="user-task-instructions">
                            <ul>
                                <li className="user-task-instructions-name">{userTask.task.name}</li>
                                <li>
                                    <label>Сложность:</label>
                                    <span>{userTask.task.taskDifficulty.name}</span>
                                </li>
                                <li>
                                    <label>Раздел:</label>
                                    <span>{userTask.task.topic.name}</span>
                                </li>
                                <li>
                                    <label>Язык:</label>
                                    <span>{userTask.task.languageName}</span>
                                </li>
                                <li>
                                    <label>Описание:</label>
                                    <p>{userTask.task.description}</p>
                                </li>
                            </ul>
                            <div className="user-task-cancel-btn-container">
                                <button onClick={() => setDeleteModal(!deleteModal)} className="user-details-cancel-button">
                                    <img src={reject_icon}></img>
                                    <span>Отменить задание</span>
                                </button>
                            </div>
                        </div>
                }
                { (viewedBlock==="comment") &&
                    <>
                        <textarea
                            className="user-details-comment"
                            name="info"
                            onChange={onChange}
                            value={comment}
                        />
                        <div className="user-task-accept-button-container">
                            <button onClick={handleSave} className="user-task-accept-button">Сохранить</button>
                        </div>
                    </>    
                }
                { (viewedBlock==="metrics") &&
                        <div>
                            {
                                userTask.analyzed
                                    ? <div className="user-task-metrics-btn-container">
                                        <a href={sonarURL+"/dashboard?id="+userTask.sonarKey} target="_blank" >Анализ в Sonar Qube</a>
                                      </div>
                                    : <div className="user-task-metrics-btn-container">
                                        <span> Анализ кода в Sonar Qube</span>
                                        <div>
                                            <button onClick={handleSonarAnalysis} className="user-task-accept-button">Начать</button>
                                        </div>
                                      </div>
                            }
                        </div>

                }
                { backToTopButton && (<img  className="to-top" onClick={scrollUp}   src={slide_up_icon} alt="scrollUp"/>)}
            </div>
        </div>
    )
}

export default UserTask;