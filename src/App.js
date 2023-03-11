import React, { useState } from 'react'
import { Routes, Route} from 'react-router-dom';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/Login'
import CandidateMainContent from './components/CandidateMainContent'
import AdminMainContent from './components/AdminMainContent'
import Home from './components/Home'

function App(){

    const [userProfile, setUserProfile] = useState({
        role:""
    })

    function updateStateUserProfile(recievedUserProfile){
        setUserProfile(recievedUserProfile)
    }

    return(

        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/login" element={
                        <Login 
                            updateStateUserProfile={updateStateUserProfile}
                            userProfile={userProfile}
                        />
                    }/>
                    <Route path="/candidate" element={<CandidateMainContent userProfile={userProfile}/>}/>
                    <Route path="/admin" element={<AdminMainContent userProfile={userProfile}/>}/>
                    <Route path="/" element={
                        <Login
                            updateStateUserProfile={updateStateUserProfile} 
                            userProfile={userProfile}
                        />
                    }/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App