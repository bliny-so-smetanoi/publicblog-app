import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";
import {useTranslation} from "react-i18next";

export default function Account(){
    const {userId} = useContext(AuthContext)
    const [info,setInfo] = useState({})
    const [greeting, setGreeting] = useState('')
    const {request} = useHttp()
    const {t, i18n} = useTranslation()
    const fetchInfo = useCallback(async()=>{
        try{
            const greetings = ['Welcome there',
                'What\'s up',
                'Hi',
                'Welcome dear',
                'For you w/ love',
                'Welcome back',
                'My pleasure to see you here']

            const data = await request('/api/auth/info','POST',{userId})

            if (data) {
                setGreeting(greetings[Math.floor(Math.random()*greetings.length)])
            }

            setInfo(data)
        }catch (e){}
    },[request,userId])

    useEffect(()=>{
        fetchInfo()
    },[fetchInfo])

    return(
        <>
            <h3 align={'right'}>{t(greeting)}, {info.name}!</h3>
            <p align={'right'}>{t('Check new posts!')}</p>
        </>
    )
}