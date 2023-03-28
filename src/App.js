import Login from './components/Login';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import ModeratorPage from './components/ModeratorPage';
import Home from './components/Home'
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import React, { useState } from 'react';
import { Routes, Route} from 'react-router-dom';


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
            <Route element={<RequireAuth allowedRoles={["ROLE_MODERATOR"]}/>}>
                <Route path="moderator" element={<ModeratorPage/>}/>
            </Route>
            <Route element={<RequireAuth allowedRoles={["ROLE_ADMIN"]}/>}>
                <Route path="admin" element={<AdminPage />}/>
            </Route>

            {/* catch all */}
            <Route path="*" element={<Missing/>}/>
            </Route>
        </Routes>
    )
}

export default App