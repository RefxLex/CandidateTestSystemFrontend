import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderWork from "../HeaderWork";
import "./ViewTask.css";
import baseURL from "../../api/baseUrl";
import CustomRequest from "../../hooks/CustomRequest";
import slide_up_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-slide-up-50.png';
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
    const [viewedBlock, setViewedBlock] = useState("instructions");
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [solution, setSolution] = useState([]);
    let params = useParams();

    useEffect( () => {

        const userTaskPromise = CustomRequest.doGet(baseURL + "/api/user-task/" + params.userTaskId);
        userTaskPromise.then((data) => {
            setUserTask(data);
            let buffArr = [];
            for (let i = 0; i < data.userTaskSolution.length; i++) {
                let src = {
                    code: atob(data.userTaskSolution[i].code)
                }
                buffArr[i] = src;
            }
            setSolution(buffArr);
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

    return(

        <div className="user-task">
            <HeaderWork/>
            <div className="solution-container">
                <div className='solution-radio'>
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
                            id='radio_3'
                            value="comment"
                            checked={viewedBlock==="comment"}
                            onChange={handleRadio}
                    />
                    <label className='radio__label' htmlFor='radio_3'>Комментарий</label>
                </div>
                { (viewedBlock==="code") &&
                        
                            solution.map((sol, id) =>
                                <div className="user-details-code-container">
                                    <CodeMirror
                                        value={sol.code}
                                        extensions={defineLanguage(userTask.task.languageName)}
                                        theme="light"
                                        readOnly={true}
                                    />
                                </div>
                            )
                        
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
                        </div>
                }
                { (viewedBlock==="comment") &&
                    <div className="start-task-comment-container">
                        <p>{userTask.comment}</p>
                    </div>    
                }
                { backToTopButton && (<img  className="to-top" onClick={scrollUp} src={slide_up_icon} alt="scrollUp"/>)}
            </div>
        </div>
    )
}

export default StartTask;