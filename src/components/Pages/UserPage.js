import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWork from '../HeaderWork';
import baseURL from '../../api/baseUrl';
import "./UserPage.css";
import CustomRequest from '../../hooks/CustomRequest';
import search_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-search-20.png';

function UserPage(){

    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    const [userTasks, setUserTasks] = useState([]);
    const [startModal, setStartModal] = useState(false);
    const [selectedId, setSelectedId] = useState();

    useEffect( () => {
        const userTasksPromise = CustomRequest.doGet(baseURL + "/api/user-task/find-list-sol-unexposed/" + id);
        userTasksPromise.then( (data) => setUserTasks(data));
    },[])

    function calcSubmitDate(userTask){
        let submiteDate = ""
        if(((userTask.submitDate)!==undefined) && ((userTask.submitDate)!==null)){
            submiteDate = userTask.submitDate.substring(0,10) + " " +  userTask.submitDate.substring(11,19);
        }
        return submiteDate
    }

    function defineNextPage(event){
        const { id } = event.target;
        let userTask = userTasks.at(id);
        if(userTask.completed){
            navigate("/user/task/view/" + userTask.id);
        }else{
            setStartModal(!startModal);
            setSelectedId(id);      
        }
    }

    function startTask(event){
        event.preventDefault();
        let userTask = userTasks.at(selectedId);
        if( ((userTask.startDate) === undefined) || ((userTask.startDate) === null)){

            sessionStorage.removeItem("status");
            sessionStorage.removeItem("statusText");
            sessionStorage.removeItem("error");
            fetch(baseURL + "/api/user-task/start/" + userTask.id, {
                method:"PUT",
                credentials: "include"
            })
            .then((response) => {
                if (response.ok) {
                    navigate("/user/task/start/" + userTask.id);
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


        }else{
            navigate("/user/task/start/" + userTask.id);
        }
    }

    function calcTaskScore(testsPassed, overallTestsCount){
        let testsPassedNum = parseInt(testsPassed);
        let overallTestsCountNum = parseInt(overallTestsCount);
        let score = "-";
        if(overallTestsCountNum > 0){
            score = (Math.round((testsPassedNum/overallTestsCountNum)*100)).toString() + "%"
        }
        return score;
    }

    return(
        <div>
            <HeaderWork/>
            {/* Modal start task*/}
            <>
                {startModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div className='user-page-warning-msg'>
                                <div>
                                    <div>
                                        <span>Начать задание?</span>
                                    </div>
                                    <p>Внимание: Время от старта задания до отправки ответа будет сохранено как время выполнения.</p>
                                </div>
                            </div>
                            <form>
                                <div className="modal-btn-container">
                                    <button onClick={() => setStartModal(!startModal)} className="user-details-cancel-button">Нет</button>
                                    <button onClick={startTask} className="user-details-accept-button">Да</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            <div className='user-page'>
                <table className="user-details-table">
                        <thead>
                            <tr>
                                <th> </th>
                                <th>Задание</th>
                                <th>Язык</th>
                                <th>Назначено</th>
                                <th>Выполнено</th>
                                <th>Отправлено</th>
                                <th>Баллы</th>
                                <th>Затраченное время</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userTasks.map( (userTask, rowId) =>
                                    <tr key={rowId}>
                                        <td>
                                            <img id={rowId} onClick={defineNextPage}
                                            src={search_icon} alt="view" className="user-details-edit-icon"/>
                                        </td>
                                        <td>{userTask.taskName}</td>
                                        <td>{userTask.taskLanguageName}</td>
                                        <td>{userTask.assignDate.substring(0,10) + " " +  userTask.assignDate.substring(11,19)}</td>
                                        <td>
                                            { (userTask.completed)
                                                ? <span>Да</span>
                                                : <span>Нет</span>
                                            }
                                        </td>
                                        <td>{calcSubmitDate(userTask)}</td>
                                        <td>{calcTaskScore(userTask.testsPassed, userTask.overallTestsCount)}</td>
                                        <td>{userTask.timeSpent}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserPage;