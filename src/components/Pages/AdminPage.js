import React, { useEffect, useState} from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import HeaderWork from '../HeaderWork';
import Pagination from '../Pagination';
import "./AdminPage.css";
import status_small_1 from '../../images/status_small1.png';
import status_small_2 from '../../images/status_small_2.png';
import status_small_3 from '../../images/status_small_3.png';
import status_small_4 from '../../images/status_small_4.png';
import search_icon from '../../images/icons8-search-20.png';
import status_large_1 from '../../images/status_large_1.png';
import status_large_2 from '../../images/status_large_2.png';
import status_large_3 from '../../images/status_large_3.png';
import status_large_4 from '../../images/status_large_4.png';
import status_all from '../../images/status_all.png';
import mail_icon from '../../images/mail-143.png';
import baseURL from '../../api/baseUrl';
import CustomRequest from '../../hooks/CustomRequest';
import warning_icon from "../../images/icons8-error-30.png";

function AdminPage(){

    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [fullName, setFullName] = useState("");
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState("ASC");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [search, setSearch] = useSearchParams();
    const location = useLocation();
    const [errorMsg, setErrorMsg] = useState("");
    const [modal, setModal] = useState(false);
    const [profile, setProfile]=useState({
        fullName: "",
        email: "",
        phone: "",
        info: ""
    })

    // get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

    useEffect( () => {
        let status = search.get("status");
        let fullName = search.get("full_name");
        let page = search.get("page");
        let order = search.get("order");

        if(page!==null){
            setCurrentPage(page);
        }
        if(order!==null){
            setOrder(order);
        }

        if( (status!==null) && (fullName!==null)){
            const userPromise = CustomRequest.doGet(baseURL + "/api/user/filter?status=" + status + "&full_name=" + fullName);
            userPromise.then((data) => setUsers(data));
        }

    },[])

    function handleChangeStatus(event){
        const { value } = event.target;

        setSearch({
            status: value,
            full_name: fullName,
            page: currentPage,
            order: order
        })
    
        setStatus(event.target.value);
        const userPromise = CustomRequest.doGet(baseURL + "/api/user/filter?status=" + value + "&full_name=" + fullName);
        userPromise.then((data) => setUsers(data));
    }

    function handleSubmit(event){
        event.preventDefault();
        setSearch({
            status: status,
            fullName: fullName,
            page: currentPage,
            order: order
        })
        const userPromise = CustomRequest.doGet(baseURL + "/api/user/filter?status=" + status + "&full_name=" + fullName);
        userPromise.then((data) => setUsers(data));
    }

    function handleSave(){
        let responseStatus;
        setErrorMsg("");
        if(profile.fullName===""){
            setErrorMsg("Поле ФИО не должно быть пустым!");
            return;
        } else if(profile.email===""){
            setErrorMsg("Поле эл.почта не должно быть пустым!");
            return;
        } else if(profile.phone===""){
            setErrorMsg("Поле тел. не должно быть пустым!");
            return;
        }else if(emailValidation()==false){
            setErrorMsg("Поле эл. почта не содержит эл. почту!");
            return;
        }else if(phoneValidation()==false){
            setErrorMsg("Поле тел. не содержит номер телефона!");
            return;
        }
        else {
            sessionStorage.removeItem("status");
            sessionStorage.removeItem("statusText");
            sessionStorage.removeItem("error");
            fetch(baseURL + "/api/user/create", {
                method:"POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else{
                    if(response.status==400){
                        responseStatus = response.status;
                        return response.json();
                    } else {
                        sessionStorage.setItem("status", response.status);
                        sessionStorage.setItem("statusText", response.statusText);
                        navigate("/error");
                    }
                }
            })
            .then(result => {
                if(responseStatus==400){
                    try{
                        if((result.message).includes("Email")){
                            setErrorMsg("Пользователь с такой эл.почтой уже существует!");
                        }else if ((result.message).includes("Phone")){
                            setErrorMsg("Пользователь с таким номером телефона уже существует!");
                        }
                    }
                    catch(TypeError){
                        console.log(TypeError);
                        setErrorMsg("bad request");
                    }              
                }else{
                    toggleModal();
                    setUsers([...users, result]); 
                }
            })
            .catch((error) => {
                console.error(error);
                sessionStorage.setItem("error", error);
                navigate("/error");
            });
        }

    }

    const emailValidation = () => {
        const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regEx.test(profile.email)) {
          return true;
        } else {
          return false;
        }
    }

    const phoneValidation = () => {
        const regEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (regEx.test(profile.phone)) {
          return true;
        } else {
          return false;
        }
    }
    

    function handleInput(event) {
        setFullName(event.target.value);
    }

    function defineTableRowIcon(userStatus){
        let icon;
        switch (userStatus) {
            case "invited":
                icon = mail_icon;
                break;
            case "started":
                icon = status_small_2;
                break;
            case "submitted":
                icon = status_small_1;
                break;
            case "approved":
                icon = status_small_3;
                break;
            case "rejected":
                icon = status_small_4;
                break; 
            default:
                icon="_";
                break;
        }
        return icon;
    }

    const sorting = (col) => {

        if(order==="ASC"){
            const sorted = [...users].sort( (a,b) =>
                a[col] > b[col] ? 1 : -1
            );
            setUsers(sorted)
            setOrder("DSC");
            setSearch({
                status: status,
                fullName: fullName,
                page: currentPage,
                order: "DSC"
            })
        }
        if(order==="DSC"){
            const sorted = [...users].sort( (a,b) =>
                a[col] < b[col] ? 1 : -1
            );
            setUsers(sorted)
            setOrder("ASC");
            setSearch({
                status: status,
                fullName: fullName,
                page: currentPage,
                order: "ASC"
            })
        }
    }

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearch({
            status: status,
            fullName: fullName,
            page: pageNumber,
            order: order
        })
    };

    const toUserDetails=(event)=>{
        navigate('/user-details/' + event.target.id);
    }

    const toggleModal = () => {
        setProfile({
            fullName: "",
            email: "",
            phone: "",
            info: ""
        })
        setModal(!modal);
    }

    function onChange(event){
        const {value, name} = event.target
        setProfile( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
    }

    function translateToRussian(status){
        switch (status) {
            case "started":
                return "приступил";
            case "submitted":
                return "отправил";
            case "approved":
                return "принят";
            case "rejected":
                return "отклонён";
        }
    }

    return(
        <div>
            <HeaderWork/>
            {/* Modal add user*/}
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
                                        required
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
                                <div className="admin-page-error-block">
                                    { errorMsg &&
                                        <>
                                        <img src={warning_icon} className='admin-page-warning-icon'/>
                                        <span>{errorMsg}</span>
                                        </>
                                    }
                                </div>
                                <div className="modal-btn-container">
                                    <button onClick={toggleModal} className="user-details-cancel-button">Отмена</button>
                                    <button onClick={handleSave} className="user-details-accept-button">Сохранить</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </>
            <div className='admin_page_container'>
                <div className='admin_page_search_container'>
                    <form onSubmit={handleSubmit} className='admin_page_search_bar'>
                        <img src={search_icon}></img>
                        <input 
                            type="text"
                            name="search"
                            placeholder='Поиск кандидата'
                            value={fullName}
                            onInput={handleInput}
                        />
                    </form>
                    <div className='radio'>
                        <input 
                            className="radio__input" 
                            type="radio"
                            name="status"
                            id='myRadio0'
                            value="invited"
                            checked={status==="invited"}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio0'><img src={mail_icon}/>Приглашен</label>
                        <input 
                            className="radio__input" 
                            type="radio" 
                            name="status"
                            id='myRadio1'
                            value="started"
                            checked={status==="started"}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio1'><img src={status_large_2}/>Выполняет</label>
                        <input 
                            className="radio__input" 
                            type="radio" 
                            name="status" 
                            id='myRadio2'
                            value="submitted" 
                            checked={status==="submitted"}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio2'><img src={status_large_1}/>Отправил</label>
                        <input 
                            className="radio__input" 
                            type="radio"  
                            name="status"
                            id='myRadio3'
                            value="approved"
                            checked={status==="approved"}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio3'><img src={status_large_3}></img>Принят</label>
                        <input 
                            className="radio__input" 
                            type="radio" 
                            name="status"
                            id='myRadio4'
                            value="rejected"
                            checked={status==="rejected"}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio4'><img src={status_large_4}/>Отклонен</label>
                        <input 
                            className="radio__input" 
                            type="radio" 
                            name="status"
                            id='myRadio5'
                            value=""
                            checked={status===""}
                            onChange={handleChangeStatus}
                        />
                        <label className='radio__label' htmlFor='myRadio5'><img src={status_all}/>Все</label>
                    </div>
                    <div className='admin_page_invite_button_container'>
                        <button onClick={toggleModal} className="admin_page_invite_button">Добавить кандидата</button>
                    </div>
                </div>

                    <div className='table_container'>
                        <table className='content-table'>
                            <thead>
                                <tr>
                                    <th className='content-table-first-column'> </th>
                                    <th onClick={()=> sorting("fullName")} className='content-table-second-column'>Кандидат</th>
                                    <th onClick={()=> sorting("userStatus")} className='content-table-column'>Статус</th>
                                    <th onClick={()=> sorting("lastScore")}  className='content-table-column'>Баллы</th>
                                    <th onClick={()=> sorting("lastActivity")} className='content-table-column'>Активность</th>
                                </tr>
                            </thead>
                            <tbody id='userTable'>
                                {
                                    currentPosts.map((user, rowId) => 
                                    <tr key={rowId}>
                                        <td className='content-table-first-column'><img src={defineTableRowIcon(user.userStatus)}/></td>
                                        <td className='content-table-second-column' 
                                            id={user.id} 
                                            onClick={toUserDetails}
                                        >
                                            {user.fullName}
                                        </td>
                                        <td className='content-table-column'>{translateToRussian(user.userStatus)}</td>
                                        <td className='content-table-column'>{user.lastScore}</td>
                                        <td className='content-table-column'>{user.lastActivity}</td>
                                    </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <div className="assign-task-pagination">
                            <Pagination postsPerPage={postsPerPage} totalPosts={users.length} paginate={paginate} />
                        </div>
                    </div>

            </div>
        </div>
    )
}

export default AdminPage;