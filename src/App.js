import React from 'react';
import { Routes, Route} from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Login from './components/Pages/Login';
import UserDetails from './components/Pages/UserDetails';
import UserPage from './components/Pages/UserPage';
import AdminPage from './components/Pages/AdminPage';
import Home from './components/Pages/Home'
import Layout from './components/Layout';
import Missing from './components/Pages/Missing';
import Unauthorized from './components/Pages/Unauthorized';
import UserTask from './components/Pages/UserTask';
import AssignTask from './components/Pages/AssignTask';
import Tasks from './components/Pages/Tasks';
import EditTask from './components/Pages/EditTask';
import CreateTask from './components/Pages/CreateTask';


function App(){

    return(
        <Routes>

            <Route path="/" element={ <Layout/> }>
            {/* public routes*/}
            <Route path="login" element={<Login />}/>
            <Route path="unauthorized" element={<Unauthorized/>}/>
            <Route path="/" element={<Home/>} />

            {/* protected routes*/}
            <Route element={<RequireAuth allowedRoles={["ROLE_USER"]} />}>
                <Route path="user" element={<UserPage />}/>
            </Route>
            <Route element={<RequireAuth allowedRoles={["ROLE_ADMIN", "ROLE_MODERATOR"]}/>}>
                <Route path="admin" element={<AdminPage />}/>
                <Route path="user-details/:userId" element={<UserDetails />}/>
                <Route path="user-task/:userTaskId" element={<UserTask />}/>
                <Route path="assign-task/:userId" element={<AssignTask/>}/>
            </Route>
            <Route element={<RequireAuth allowedRoles={["ROLE_ADMIN"]}/>}>
                <Route path="/tasks" element={<Tasks />}/>
                <Route path="/task/edit/:taskId" element={<EditTask />}/>
                <Route path="/task/create" element={<CreateTask />}/>
            </Route>

            {/* catch all */}
            <Route path="*" element={<Missing/>}/>
            </Route>
        </Routes>
    )
}

export default App