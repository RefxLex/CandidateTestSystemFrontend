import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderWork from "../HeaderWork";
import "./ViewTask.css";
import baseURL from "../../api/baseUrl";
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
    const [codeLanguage, setCodeLanguage] = useState([]);
    const [backToTopButton, setBackToTopButton] = useState(false);
    const [codeDecoded, setCodeDecoded] = useState("");
    let params = useParams();

    useEffect( () => {

        const userTaskPromise = doGet("/api/user-task/" + params.userTaskId);
        userTaskPromise.then((data) => {
            setUserTask(data);
            setCodeLanguage(defineLanguage(data.taskCodeLanguageId));
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
        setViewedBlock(event.target.value);
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

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "auto"
        })
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
                        <div className="user-details-code-container">
                            <CodeMirror
                                value={codeDecoded}
                                extensions={codeLanguage}
                                theme="light"
                                readOnly={true}
                            />
                        </div>
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