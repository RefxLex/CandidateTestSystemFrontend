import React, { useEffect, useState } from "react";
import HeaderWork from "../HeaderWork";
import Pagination from "../Pagination";
import baseURL from "../../api/baseUrl";
import "./AddAdmins.css";
import delete_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-delete-20.png';

function AddAdmins(){

    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [users, setUsers] = useState([]);
    const [profile, setProfile]=useState({
        fullName: "",
        email: "",
        phone: "",
        info: ""
    })
    const [role, setRole] = useState("ROLE_MODERATOR");

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

    useEffect( () => {
        const userPromise = doGet("/api/user/admins");
        userPromise.then((data) => setUsers(data));
    },[])

    function handleSave(event){
        event.preventDefault();
        const userPromise = doPost("/api/user/create/admin?role=" + role, profile);
        userPromise.then( (data) => {
            setModal(!modal);
            setUsers([...users, data]);
        });
    }

    function handleDelete(event){
        event.preventDefault();
        const userPromise = doDelete("/api/user/" + selectedId);
        userPromise.then( () => location.reload());
    }

    function delModal(event){
        const { id } = event.target;
        setSelectedId(id);
        setDeleteModal(!deleteModal);
    }

    function onChange(event){
        const {value, name} = event.target
        setProfile( (prevObj) => ({
            ...prevObj,
            [name]: value
        }))
    }

    function toggleModal(){
        setProfile({
            fullName: "",
            email: "",
            phone: "",
            info: ""
        });
        setModal(!modal);
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

    async function doDelete(resourceURL){
        try{
            const response = await fetch (baseURL + resourceURL, {
                method:"DELETE",
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

    return (
        <div>
            <HeaderWork/>
            <div className="add-admins">
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
                {/* Modal add admin*/}
                <>
                    {modal &&
                        <div className="modal">
                            <div className="overlay"></div>
                            <div className="modal-content">
                                <div>
                                    <span>Данные сотрудника</span>
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
                                    <div>
                                        <label htmlFor="role">Роль</label>
                                        <select className="assign-task-select"
                                            id="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            name="role"
                                        >
                                            <option value="ROLE_MODERATOR">модератор</option>
                                            <option value="ROLE_ADMIN">админ</option>
                                        </select>
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
                {/* Main content*/}
                <div className='admin_page_invite_button_container'>
                    <button onClick={() => setModal(!modal)} className="admin_page_invite_button">Добавить</button>
                </div>
                <div className='table_container'>
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th className="content-table-column"></th>
                                <th className="content-table-column">Сотрудник</th>
                                <th className="content-table-column">Роль</th>
                                <th className="content-table-column">Эл. почта</th>
                                <th className="content-table-column">Тел.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentPosts.map((user, rowId) => 
                                <tr key={rowId}>
                                    <td className='content-table-column'>
                                        <img className="user-details-edit-icon" onClick={delModal} 
                                            id={user.id} src={delete_icon}/>
                                    </td>
                                    <td className='content-table-column'>{user.fullName}</td>
                                    <td className='content-table-column'>{user.roles.at(0).name}</td>
                                    <td className='content-table-column'>{user.email}</td>
                                    <td className='content-table-column'>{user.phone}</td>
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

export default AddAdmins;
