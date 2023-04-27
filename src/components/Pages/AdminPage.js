import React, { useEffect, useState} from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import HeaderWork from '../HeaderWork';
import Pagination from '../Pagination';
import "./AdminPage.css";
import status_small_1 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_small1.png';
import status_small_2 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_small_2.png';
import status_small_3 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_small_3.png';
import status_small_4 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_small_4.png';
import search_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-search-20.png';
import status_large_1 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_large_1.png';
import status_large_2 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_large_2.png';
import status_large_3 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_large_3.png';
import status_large_4 from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_large_4.png';
import status_all from '/work/web_projects/CandidateTestSystemFrontend/src/images/status_all.png';
import mail_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/mail-143.png';
import baseURL from '../../api/baseUrl';

function AdminPage(){

    const [status, setStatus] = useState("");
    const [fullName, setFullName] = useState("");
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState("ASC");

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [search, setSearch] = useSearchParams();
    const location = useLocation();

    const [modal, setModal] = useState(false);
    const [profile, setProfile]=useState({
        fullName: "",
        email: "",
        phone: "",
        info: ""
    })

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
            getUsers("/api/user/filter?status=" + status + "&full_name=" + fullName);
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
        getUsers("/api/user/filter?status=" + value + "&full_name=" + fullName);
    }

    function handleSubmit(event){
        event.preventDefault();
        setSearch({
            status: status,
            fullName: fullName,
            page: currentPage,
            order: order
        })
        getUsers("/api/user/filter?status=" + status + "&full_name=" + fullName);
    }

    function handleInput(event) {
        setFullName(event.target.value);
    }

    async function getUsers(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"GET",
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const result = await response.json();
            setUsers(result);
            return result;
        }
        catch(error){
            console.error("There has been a problem with your fetch operation:", error);
        }
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

    // get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

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

    const navigate = useNavigate();

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

    function handleSave(){
        const userPromise = doPost("/api/user/create", profile);
        userPromise.then( (data) => {
            toggleModal();
            setUsers([...users, data]);
        });
    }

    async function doPost(resourceURL, body){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"POST",
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
                                    <td className='content-table-column'>{user.userStatus}</td>
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