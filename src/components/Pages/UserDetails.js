import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import arrow_right from '/work/web_projects/CandidateTestSystemFrontend/src/images/arrow-right-40_2.png';
import approve_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/approve_icon1.png';
import reject_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-close-20.png';
import edit_icon from '/work/web_projects/CandidateTestSystemFrontend/src/images/icons8-pencil-20.png';
import HeaderWork from "../HeaderWork";
import baseURL from "../../api/util";
import "./UserDetails.css";

import CodeMirror from '@uiw/react-codemirror';
//import { javascript } from '@codemirror/lang-javascript';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';


const codetext = `
import java.io.*;
import java.util.*;
import java.text.*;
public class zadacha
{
    public static void main(String []args) throws IOException {     
        SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");        
        ArrayList<Person> list = new ArrayList<Person>();
        FileReader f1 = null;
    try{
        f1 = new FileReader("C:\\work\\tehnopolis_java\\java_prj\\zadacha_ivt\\list2.txt");
        BufferedReader dataInput = new BufferedReader(f1);
        //System.setOut(new java.io.PrintStream(System.out, true, "UTF-8"));
        String buff=" ";
        String dayBuff;
        String monthBuff;
        String yearBuff;
        Date recDate;
        String nameBuff;
        String surnameBuff;
        String cityBuff;
        String preLastLine=" ";
        String lastLine=" ";
        GregorianCalendar recGDate=null;
        int i=0;
        int namePos;
        int surnamePos;
        int cityPos;
        int dayPos;
        int monthPos;
        int row=1;
        boolean city=true;
            while(buff != null){
                preLastLine=lastLine;
                lastLine=buff;
                buff = dataInput.readLine();
                if(buff != null){
                    namePos=buff.indexOf(' ');
                    surnamePos=-1;
                    cityPos=-1;
                    dayPos=-1;
                    monthPos= -1;
                    if (namePos!=-1 ){     // person  
                    nameBuff = buff.substring(0,namePos);
                    surnamePos=buff.indexOf(' ',namePos+1);
                        if(surnamePos!=-1){
                            surnameBuff = buff.substring(namePos+1,surnamePos);
                            cityPos=buff.indexOf(' ',surnamePos+1);
                            if(cityPos!= -1){
                                cityBuff = buff.substring(surnamePos+1, cityPos);
                                dayPos = buff.indexOf('.',cityPos+1);
                                if(dayPos!= -1){
                                    dayBuff = buff.substring(dayPos-2,dayPos);
                                    monthPos = buff.indexOf('.',dayPos+1);
                                    if(monthPos!= -1){
                                        monthBuff = buff.substring(monthPos-2, monthPos);
                                        yearBuff = buff.substring(monthPos+1, buff.length());
                                        GregorianCalendar vDate = new GregorianCalendar(Integer.parseInt(yearBuff),Integer.parseInt(monthBuff),Integer.parseInt(dayBuff));
                                        list.add(new Person(nameBuff,surnameBuff,cityBuff,vDate));
                                    }
                                    else{
                                        throw new InputParamException(row);
                                    }
                                }
                                else{
                                    throw new InputParamException(row);
                                }

                            }
                            else{
                                throw new InputParamException(row);
                            }
                        }
                        else{
                            throw new InputParamException(row);
                        }
                    }
                    else{ 
                        if(buff.length()>20){  
                            throw new InputParamException(row);
                        }
                        if(city==false){
                                dayPos = buff.indexOf('.');
                                if(dayPos!= -1){
                                    dayBuff = buff.substring(dayPos-2,dayPos);
                                    monthPos = buff.indexOf('.',dayPos+1);
                                    if(monthPos!= -1){
                                                monthBuff = buff.substring(monthPos-2, monthPos);
                                                yearBuff = buff.substring(monthPos+1, buff.length());
                                                recGDate = new GregorianCalendar(Integer.parseInt(yearBuff),Integer.parseInt(monthBuff),Integer.parseInt(dayBuff));
                                            }
                                            else{
                                                throw new InputParamException(row);
                                            }
                                }
                                else{
                                    throw new InputParamException(row);
                                }
                        }
                        else{
                            city=false;
                        }
  
                    }
                }
                i=i+1;
                row=row+1;
            }
        String cityS = preLastLine;
        //System.out.println(recGDate.get(Calendar.DAY_OF_MONTH)+"."+recGDate.get(Calendar.MONTH)+"."+recGDate.get(Calendar.YEAR));
            Integer cityzens=0;
            Integer vCityzens=0;
            double pCount=0;
            double result=0;
           
            for(Person str: list){
            
                if(cityS.equals(str.m_city)==true){
                    
                    if(str.vCalc(recGDate)==true){
                        vCityzens=vCityzens+1;
                    }
                        cityzens=cityzens+1;              
                }
            }
        pCount = (double)vCityzens/cityzens*100;
        result = Math.floor(pCount);
        //System.out.println("cityzens=" + cityzens);
        //System.out.println("VCityzens=" + vCityzens);
        System.out.println("Р§РёСЃР»Рѕ РІР°РєС†РёРЅРёСЂРѕРІР°РЅРЅС‹С… Р¶РёС‚РµР»РµР№ РЅР° СѓРєР°Р·Р°РЅРЅСѓСЋ РґР°С‚Сѓ = " + (int) result +"%"); 
    }
    catch(InputParamException e){
        e.printEx();
    }
    catch(IOException e){
        System.out.println("Error.Couldn't open file");
    }
        finally{
                try{
                    f1.close();
                }
                catch(IOException e){
                    System.out.println("Error.Couldn't close file");
                }
             }
    }
}
`

function UserDetails(){

    const [user, setUser] = useState({});
    const [userTasks, setUserTasks] = useState([]);
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();
    const viewedId = sessionStorage.getItem("targetUserId");

    const [profile, setProfile]=useState({
        fullName: "",
        email: "",
        phone: "",
        info: ""
    })

    useEffect( () => {

        const userPromise = doGet("/api/user/" + viewedId);
        userPromise.then( (data) => setUser(data));

        const userTasksPromise = doGet("/api/user-task/" + viewedId);
        userTasksPromise.then( (data) => setUserTasks(data));

    },[])

    function approveUser() {
        const userPromise = doPut("/api/user/status/" + viewedId + "?status=approved", {});
        userPromise.then( () => navigate("/admin"));
    }

    function rejectUser() {
        const userPromise = doPut("/api/user/status/" + viewedId + "?status=rejected", {});
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

    const toggleModal = () => {
        setProfile({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            info: user.info
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
        const updatePromise =  doPut("/api/user/" + viewedId, {
            email: profile.email,
            fullName: profile.fullName,
            phone: profile.phone,
            info: profile.info
        })
        updatePromise.then( () => location.reload() );
    }



    return(
        <div>
            <HeaderWork/>
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
                </div>
                <button className="user-details-assign-button">Назначить задание</button>
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
                                <th>Задание</th>
                                <th>Язык</th>
                                <th>Назначено</th>
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
                                        <td>{userTask.task.name}</td>
                                        <td>{userTask.languageName}</td>
                                        <td>{userTask.assignDate.substring(0,10) + " " +  userTask.assignDate.substring(11,19)}</td>
                                        <td>{ (Math.round((parseInt(userTask.testsPassed)/parseInt(userTask.overallTestsCount))*100))
                                        .toString() + "%" }</td>
                                        <td>{ userTask.testsPassed + "/" + userTask.overallTestsCount }</td>
                                        <td>{userTask.timeSpent}</td>
                                        <td>{userTask.userTaskResult.at(0).time}s</td>
                                        <td>{userTask.userTaskResult.at(0).memory}Kb</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                {/*<div className="user-details-task-container">
                    <div className="user-details-code-label">
                        <span>Roman to Integer</span>
                        <span>Java</span>
                        <button className="user-details-code-more-button">Подробнее</button>
                    </div>
                    <div className="user-details-code-view">
                        <div>
                            <ul className="user-details-remind-code-info-list">
                                <li>Код решения</li>
                                <li>3/3 Тестов пройдено, 2 дня времени затрачено, 14560.0 время исполнения</li>
                            </ul>
                        </div>
                        <div className="user-details-code-container">
                            <CodeMirror
                                //value="console.log('hello world!');"
                                value={codetext}
                                //height="200px"
                                //extensions={[javascript({ jsx: true })]}
                                extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
                                //theme={okaidia}
                                //onChange={onChange}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default UserDetails;