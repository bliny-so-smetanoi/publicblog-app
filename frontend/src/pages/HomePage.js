import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http-hook";
import ListOfArticles from "../components/ListOfArticles";
import NewPost from "../components/NewPost";
import Account from "../components/Account";
import {AuthContext} from "../context/AuthContext";
export default function HomePage(){
    const {loading,request} = useHttp()
    const [articles, setArticles] = useState()
    const {isAuth, userId} =useContext(AuthContext)

    const fetchArticles = useCallback(async()=>{
        try{
            const fetched = await request('/api/articles/')
            setArticles(fetched)
        }catch (e){}
    },[request])

    useEffect(()=>{
        fetchArticles()
    },[fetchArticles])

    return(
        <>
            <main className={'homepage-main'}>
                <div style={{display:'flex', flexDirection:'row',justifyContent:'space-between'}}><NewPost onCreate={fetchArticles}/>
                <div className={'homepage-account'}>
                    {(isAuth&&userId!==null)&&<Account/>}
                    {loading&&<div>Loading...</div>}
                </div>
                </div>
                <div className={'homepage-main-container'}>
                    <p style={{fontSize:'20px'}}>Recent posts:</p>
                    {loading && <div>Loading...</div>}
                    {(articles !==undefined && !loading) && <ListOfArticles articles={articles}/>}
            </div>
            </main>
        </>
    )
}