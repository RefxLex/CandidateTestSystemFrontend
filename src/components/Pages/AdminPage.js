import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
import mail_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/mail-143.png';
import baseURL from '../../api/util';

function AdminPage(){

    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState("ASC");

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect( () => {

        let resourceURL="";
        let currentPage=1;
        if(sessionStorage.getItem("mainPageAdminCurrent")){
            currentPage = parseInt(sessionStorage.getItem("mainPageAdminCurrent"));
        }
        switch (sessionStorage.getItem("mainPageAdminAction")) {
            case "filter":
                resourceURL = "/api/user/filter?status=" + sessionStorage.getItem("status");
                const filterPromise = getUsers(resourceURL);
                filterPromise.then( data => setCurrentPage (currentPage));
                break;
            case "search":
                resourceURL = "/api/user/search?name=" + sessionStorage.getItem("search");
                const searchPromise = getUsers(resourceURL);
                searchPromise.then( data => setCurrentPage (currentPage));
                break;
            default:
                break;
            }
        //console.log("page rendered");
    },[])

    function handleChangeStatus(event){
        sessionStorage.setItem("status", event.target.value);
        sessionStorage.setItem("mainPageAdminAction", "filter");
        setStatus(event.target.value);
        getUsers("/api/user/filter?status=" + event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        sessionStorage.setItem("mainPageAdminAction","search");
        sessionStorage.setItem("search", search);
        getUsers("/api/user/search?name=" + search);
    }

    function handleInput(event) {
        setSearch(event.target.value);
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

    /*
    function getUsers(resourceURL) {
        setLoading(true);
        fetch(baseURL + resourceURL, {
            method:"GET",
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                return response.json();
            })
            .then(result => {
                setUsers(result)
                setLoading(false)
                return result;
                //console.log(result);
            })
            .catch((error) => {
                console.error("There has been a problem with your fetch operation:", error);
        });
    } */

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
        }
        if(order==="DSC"){
            const sorted = [...users].sort( (a,b) =>
                a[col] < b[col] ? 1 : -1
            );
            setUsers(sorted)
            setOrder("ASC");
        }
    }

    // get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigate = useNavigate();

    const toUserDetails=(event)=>{
        sessionStorage.setItem("mainPageAdminCurrent", currentPage);
        navigate('/details',{state:{id:event.target.id}});
    }

    return(
        <div>
            <HeaderWork/>
            <div className='admin_page_container'>
                <div className='admin_page_search_container'>
                    <form onSubmit={handleSubmit} className='admin_page_search_bar'>
                        <img src={search_icon}></img>
                        <input 
                            type="text"
                            name="search"
                            placeholder='Поиск кандидата'
                            value={search}
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
                    <Pagination postsPerPage={postsPerPage} totalPosts={users.length} paginate={paginate} />
                </div>
            </div>
        </div>
    )
}

export default AdminPage;