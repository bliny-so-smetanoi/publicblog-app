import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http-hook";
import ListOfArticles from "../components/ListOfArticles";
import NewPost from "../components/NewPost";
import Account from "../components/Account";
import {AuthContext} from "../context/AuthContext";
export default function HomePage(){
    const {isAuth, userId} = useContext(AuthContext)
    const {loading,request} = useHttp()
    const [articles, setArticles] = useState()

        const fetchAuth = useCallback(async()=> {
            const id = JSON.parse(localStorage.getItem('userData'))
            console.log(localStorage.getItem('userData'))
            console.log(id)
            if(id === null) {
                const fetched = await request('/api/articles/', 'GET', null, {'Authorization': 'Bearer ' + ' '})
                setArticles(fetched)
                return
            }

            const fetched = await request('/api/articles/', 'GET', null, {'Authorization': 'Bearer ' + id['userId']})
            setArticles(fetched)
        }, [request])

        useEffect(()=>{
            fetchAuth()
        },[fetchAuth])

    return(
        <>
            <main className={'homepage-main'}>
                <div className={'homepage-main-header'}><NewPost onCreate={fetchAuth}/>
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