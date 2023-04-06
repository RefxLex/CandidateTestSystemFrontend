import React, {useEffect, useState} from "react";
import "./UserTask.css";
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/util";
import back_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-back-arrow-30_2.png';
import slide_up_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-slide-up-50.png';
import expand_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-more-information-20.png';
import close_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-window-30.png';
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
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { solarizedLight, solarizedLightInit, solarizedDark, solarizedDarkInit } from "@uiw/codemirror-theme-solarized";

function UserTask() {

    const [userTask, setUserTask] = useState({});
    const [viewedBlock, setViewedBlock] = useState("code");
    const viewedTaskId = sessionStorage.getItem("targetTaskId");
    const [codeLanguage, setCodeLanguage] = useState([]);
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [modal, setModal] = useState(false);
    const [comment, setComment] = useState("");
    const [codeDecoded, setCodeDecoded] = useState("");

    useEffect( () => {

        const userTaskPromise = doGet("/api/user-task/" + viewedTaskId);
        userTaskPromise.then((data) => {
            console.log(data);
            setUserTask(data);
            setCodeLanguage(defineLanguage(data.languageName));
            //let code = Buffer.from(data.code,'base64')
            let code = atob(data.code);
            setCodeDecoded(code);
        });

        window.addEventListener("scroll", () => {
            if(window.scrollY > 100){
                setBackToTopButton(true);
            }else{
                setBackToTopButton(false);
            }
        })

    },[])

    function handleRadio(event){
        console.log(event.target.value);
        if( (event.target.value==="comment")){
            console.log(userTask.comment);
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
        const updatePromise = doPut("/api/user-task/" + viewedTaskId, {
            comment: comment
        })
        updatePromise.then( () => location.reload() );
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

    return(

        <div className="user-task">
            <HeaderWork/>
            <div className="solution-header">
                <span>Кузовкина Жанна Олеговна. Решение задачи Roman to Integer.</span>
                <a href="/details"><span>Обратно</span><img src={back_icon} alt="close"/></a>
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
                </div>
                { (viewedBlock==="code") &&
                        <div className="user-details-code-container">
                            <CodeMirror
                                value={codeDecoded}
                                //value={codetext}
                                extensions={codeLanguage}
                                theme="light"
                                //onChange={onChange}
                                readOnly={true}
                            />
                        </div>
                }
                { (viewedBlock==="tests") &&
                    <div>
                        {/* Modal view additional info*/}
                        {<>  
                            {modal &&
                                <div className="modal">
                                    <div className="overlay"></div>
                                    <div className="solution-modal">
                                        <div>
                                            <img src={close_icon} alt="close" onClick={expand}/>
                                        </div>
                                        <table className="user-details-table">
                                            <thead>
                                                <tr>
                                                    <th>Номер</th>
                                                    <th>created_at</th>
                                                    <th>exit_signal</th>
                                                    <th>finished_at</th>
                                                    <th>submissionToken</th>
                                                    <th>wall_time</th>
                                                    <th>stderr</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    userTask.userTaskResult.map( (result, blockId) =>
                                                        <tr key={blockId}>
                                                            <td>{blockId}</td>
                                                            <td>{result.created_at}</td>
                                                            <td>{result.exit_signal}</td>
                                                            <td>{result.finished_at}</td>
                                                            <td>{result.submissionToken}</td>
                                                            <td>{result.wall_time}</td>
                                                            <td>{result.stderr}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }   
                        </>}
                        <div className="user-task-tests-header">
                            <span className="user-task-tests-passed">Успешно: 3</span>
                            <span className="user-task-tests-failed">Провалено: 0</span>
                        </div>

                        <div className="user-task-tests-container">
                            {
                                <table className="user-details-table">
                                    <thead>
                                        <tr>
                                            <th>Номер</th>
                                            <th>Статус</th>
                                            <th>Время исполнения(s)</th>
                                            <th>Память(Kb)</th>
                                            <th>Входные данные</th>
                                            <th>Ожидаемый результат</th>
                                            <th>Выходные данные</th>
                                            <th>Exit code</th>
                                            <th>Результат компиляции</th>
                                            <th> 
                                                <button className="user-task-expand-button" onClick={expand}>
                                                    <img src={expand_icon} alt="expand" />
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userTask.userTaskResult.map( (result, blockId) =>
                                                <tr key={blockId}>
                                                    <td>{blockId}</td>
                                                    <td>{result.status}</td>
                                                    <td>{result.time}</td>
                                                    <td>{result.memory}</td>
                                                    <td>{result.taskTestInput.input}</td>
                                                    <td>{result.taskTestInput.output}</td>
                                                    <td>{result.stdout}</td>
                                                    <td>{result.exit_code}</td>
                                                    <td>{result.compile_output}</td>
                                                    <td> </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
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
                                    <span>{userTask.task.taskDifficulty}</span>
                                </li>
                                <li>
                                    <label>Раздел:</label>
                                    <span>{userTask.task.topic.name}</span>
                                </li>
                                <li>
                                    <label>Язык:</label>
                                    <span>{userTask.languageName}</span>
                                </li>
                                <li>
                                    <label>Описание:</label>
                                    <p>{userTask.task.description}</p>
                                </li>
                            </ul>
                            
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
                { backToTopButton && (<img  className="to-top" onClick={scrollUp}   src={slide_up_icon} alt="close"/>)}
            </div>
        </div>
    )
}

export default UserTask;