import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import arrow_right from '../../images/arrow-right-40_2.png';
import approve_icon from '../../images/approve_icon1.png';
import reject_icon from '../../images/icons8-close-20.png';
import edit_icon from '../../images/icons8-pencil-20.png';
import search_icon from '../../images/icons8-search-20.png';
import delete_icon from '../../images/icons8-delete-20.png';
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/baseUrl";
import "./UserDetails.css";
import CustomRequest from "../../hooks/CustomRequest";


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

    const userPromise = CustomRequest.doGet(baseURL + "/api/user/" + params.userId);
    userPromise.then( (data) => setUser(data));
  
    const userTasksPromise = CustomRequest.doGet(baseURL + "/api/user-task/find-list/" + params.userId);
    userTasksPromise.then( (data) => setUserTasks(data));

    },[])

    function approveUser() {

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/user/status/" + params.userId + "?status=approved", {
            method:"PUT",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                navigate("/admin");
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

    function rejectUser() {

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/user/status/" + params.userId + "?status=rejected", {
            method:"PUT",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                navigate("/admin");
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
        const updatePromise =  CustomRequest.doPutWithBody(baseURL + "/api/user/" + params.userId, {
            email: profile.email,
            fullName: profile.fullName,
            phone: profile.phone,
            info: profile.info
        })
        updatePromise.then( () => location.reload() );
    }

    function handleDelete(event){
        event.preventDefault();

        sessionStorage.removeItem("status");
        sessionStorage.removeItem("statusText");
        sessionStorage.removeItem("error");
        fetch(baseURL + "/api/user/" + params.userId, {
            method:"DELETE",
            credentials: "include"
        })
        .then((response) => {
            if (response.ok) {
                navigate("/admin");
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

    function calcSubmitDate(userTask){
        let submiteDate = ""
        if(((userTask.submitDate)!==undefined) && ((userTask.submitDate)!==null)){
            submiteDate = userTask.submitDate.substring(0,10) + " " +  userTask.submitDate.substring(11,19);
        }
        return submiteDate
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
                                            <td>{userTask.task.languageName}</td>
                                            <td>{userTask.assignDate.substring(0,10) + " " +  userTask.assignDate.substring(11,19)}</td>
                                            <td>{calcSubmitDate(userTask)}</td>
                                            <td>{ (Math.round((parseInt(userTask.testsPassed)/parseInt(userTask.overallTestsCount))*100))
                                            .toString() + "%" }</td>
                                            <td>{ userTask.testsPassed + "/" + userTask.overallTestsCount }</td>
                                            <td>{userTask.timeSpent}</td>
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