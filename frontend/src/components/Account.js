import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";

export default function Account(){
    const {userId} = useContext(AuthContext)
    const [info,setInfo] = useState({})
    const {request} = useHttp()

    const fetchInfo = useCallback(async()=>{
        try{
            const data = await request('/api/auth/info','POST',{userId})
            setInfo(data)
        }catch (e){}
    },[request,userId])

    useEffect(()=>{
        fetchInfo()
    },[fetchInfo])

    return(
        <>
            <h3 align={'right'}>Welcome, {info.name}!</h3>
            <p align={'right'}>Check new posts!</p>
        </>
    )
}