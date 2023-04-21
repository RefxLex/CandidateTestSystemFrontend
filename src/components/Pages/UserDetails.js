import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import arrow_right from '/work/web_projects/CandidateTestSystemFrontend/src/images/arrow-right-40_2.png';
import approve_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/approve_icon1.png';
import reject_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-20.png';
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';
import search_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-search-20.png';
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/util";
import "./UserDetails.css";


function UserDetails(){

    const [user, setUser] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const navigate = useNavigate();
    let params = useParams();

    const [profile, setProfile]=useState({
        fullName: "",
        email: "",
        phone: "",
        info: ""
    })

    useEffect( () => {

        const userPromise = doGet("/api/user/" + params.userId);
        userPromise.then( (data) => setUser(data));

        const userTasksPromise = doGet("/api/user-task/find/" + params.userId);
        userTasksPromise.then( (data) => setUserTasks(data));

    },[])

    function approveUser() {
        const userPromise = doPut("/api/user/status/" + params.userId + "?status=approved", {});
        userPromise.then( () => navigate("/admin"));
    }

    function rejectUser() {
        const userPromise = doPut("/api/user/status/" + params.userId + "?status=rejected", {});
        userPromise.then( () => navigate("/admin"));
    }

    const toggleModal = () => {
        setProfile({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            info: user.info
        })
        setModal(!modal);
    }

    function viewUserTask(event){
        navigate("/user-task/" + event.target.id)
    }

    function onChange(event){
        const {value, name} = event.target
        setProfile( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
    }

    function handleSave(){
        const updatePromise =  doPut("/api/user/" + params.userId, {
            email: profile.email,
            fullName: profile.fullName,
            phone: profile.phone,
            info: profile.info
        })
        updatePromise.then( () => location.reload() );
    }

    function handleDelete(event){
        event.preventDefault();
        const userPromise = doDelete("/api/user/" + params.userId);
        userPromise.then( () => navigate("/admin"));
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

    async function doDelete(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"DELETE",
                credentials: "include"
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
        <div>
            <HeaderWork/>
            {/* Modal delete user*/}
            <>
                {deleteModal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                <span>Вы точно хотите удалить пользователя?</span>
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
            {/* Modal edit profile*/}
            <>
                {modal &&
                    <div className="modal">
                        <div className="overlay"></div>
                        <div className="modal-content">
                            <div>
                                <span>Данные кандидата</span>
                            </div>
                            <form onSubmit={ (e) => e.preventDefault()}>
                                <div className="modal-txt-field">
                                    <label htmlFor="fullName">ФИО</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        onChange={onChange}
                                        value={profile.fullName}
                                        required
                                    />
                                </div>
                                <div className="modal-txt-field">
                                    <label htmlFor="email">Эл. почта</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        onChange={onChange}
                                        value={profile.email}
                                        required
                                    />
                                </div>
                                <div className="modal-txt-field">
                                    <label htmlFor="phone">Тел.</label>
                                    <input 
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        onChange={onChange}
                                        value={profile.phone}
                                    />
                                </div>
                                <div className="modal-txt-field">
                                    <label htmlFor="info">Инфо.</label>
                                    <textarea
                                        className="modal-info"
                                        name="info"
                                        onChange={onChange}
                                        value={profile.info}
                                    />
                                </div>
                                <div className="modal-btn-container">
                                    <button onClick={handleSave} className="user-details-accept-button">Сохранить</button>
                                    <button onClick={toggleModal} className="user-details-cancel-button">Отмена</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            {/* Main content */}
            <div className="user-details-container">
                <p>{user.fullName}</p>
                <ul className="user-details-contacts">
                    <li>{user.email}</li>
                    <li>{user.phone}</li>
                </ul>
                <div className="user-details-info">{user.info}
                    <img src={edit_icon} alt="edit" onClick={toggleModal} className="user-details-edit-icon"/>
                    <img src={delete_icon} alt="delete" onClick={() => setDeleteModal(!deleteModal)} className="user-details-edit-icon"/>
                </div>
                <button className="user-details-assign-button"  onClick={ () => navigate("/assign-task/" + params.userId)}>Назначить задание</button>
                <div className="user-details-progress">
                    <span className={ (user.userStatus==="invited") ? "user-details-highlight" : "user-details-no-highlight" }>Приглашен</span>
                    <img src={arrow_right}></img>
                    <span className={ (user.userStatus==="started") ? "user-details-highlight" : "user-details-no-highlight" }>Выполняет</span>
                    <img src={arrow_right}></img>
                    <span className={ (user.userStatus==="submitted") ? "user-details-highlight" : "user-details-no-highlight" }>Отправил</span>
                    <img src={arrow_right}></img>
                    { (user.userStatus==="approved") 
                        ? <span className="user-details-highlight">Принят</span>
                        : (user.userStatus==="rejected")
                            ? <span className="user-details-highlight">Отклонен</span>
                            :   <>
                                    <button onClick={approveUser} className="user-details-accept-button">
                                        <img src={approve_icon}></img>
                                        <span>Принять</span>
                                    </button>
                                    <button onClick={rejectUser} className="user-details-cancel-button">
                                        <img src={reject_icon}></img>
                                        <span>Отклонить</span>
                                    </button>
                                </> 
                    }
                </div>
                <div className="user-details-table-container">
                    <div className="user-details-label-task-list">Список<br/>заданий:</div>
                    <table className="user-details-table">
                        <thead>
                            <tr>
                                <th> </th>
                                <th>Задание</th>
                                <th>Язык</th>
                                <th>Назначено</th>
                                <th>Выполнено</th>
                                <th>Баллы</th>
                                <th>Тестов пройдено</th>
                                <th>Затраченное время</th>
                                <th>Время исполнения</th>
                                <th>Затраченная память</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userTasks.map( (userTask, rowId) =>
                                    <tr key={rowId}>
                                        <td>
                                            <img id={userTask.id} src={search_icon} onClick={viewUserTask}  alt="edit" className="user-details-edit-icon"/>
                                        </td>
                                        <td>{userTask.task.name}</td>
                                        <td>{userTask.languageName}</td>
                                        <td>{userTask.assignDate.substring(0,10) + " " +  userTask.assignDate.substring(11,19)}</td>
                                        <td>{userTask.submitDate?.substring(0,10) + " " +  userTask.submitDate?.substring(11,19)}</td>
                                        <td>{ (Math.round((parseInt(userTask.testsPassed)/parseInt(userTask.overallTestsCount))*100))
                                        .toString() + "%" }</td>
                                        <td>{ userTask.testsPassed + "/" + userTask.overallTestsCount }</td>
                                        <td>{userTask.timeSpent}</td>
                                        <td>{userTask.userTaskResult.at(0)?.time}s</td>
                                        <td>{userTask.userTaskResult.at(0)?.memory}Kb</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UserDetails;