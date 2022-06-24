import {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http-hook";
import ListOfArticles from "../components/ListOfArticles";
import NewPost from "../components/NewPost";
import Account from "../components/Account";
import {AuthContext} from "../context/AuthContext";
import Loader from "../components/Loader";
import {useTranslation} from "react-i18next";

export default function HomePage(){
    const {isAuth, userId} = useContext(AuthContext)
    const {loading,request} = useHttp()
    const [page, setPage] = useState(0)
    const [articles, setArticles] = useState([])
    const [noMoreArticles, setNoMoreArticles] = useState(false)
    const [moreIsLoading, setMoreIsLoading] = useState(false)
    const {t, i18n} = useTranslation()

    const fetchAuth = useCallback(async()=> {
        setPage(0)
        const id = JSON.parse(localStorage.getItem('userData'))
        if(id === null) {
                const fetched = await request('/api/articles/get/' + 0, 'GET', null, {'Authorization': 'Bearer ' + ' '})
                setArticles(fetched)
                return
        }

        const fetched = await request('/api/articles/get/' + 0, 'GET', null, {'Authorization': 'Bearer ' + id['userId']})
            setArticles(fetched)
        }, [request])

    useEffect(()=>{
            fetchAuth()
    },[fetchAuth])

    const loadMoreArticles = useCallback(async () => {
        const pageNum = page + 1
        const id = JSON.parse(localStorage.getItem('userData'))
        if (id === null) {
            setMoreIsLoading(true)
            const loadedArticles = await fetch('/api/articles/get/' + pageNum, {
                method: 'GET',
                headers:
                    {'Authorization': 'Bearer ' + ' ',
                        'Content-Type': 'application/json'}
            }).then((response)=> {
                setMoreIsLoading(false)
                return response.json()
            })

            if (loadedArticles.length === 0) {
                setNoMoreArticles(true)
            }

            setPage(page + 1)
            setArticles(articles.concat(loadedArticles))
            return
        }
        setMoreIsLoading(true)
        const loadedArticles = await fetch('/api/articles/get/' + pageNum, {
            method: 'GET',
            headers:
                {'Authorization': 'Bearer ' + id['userId'],
                    'Content-Type': 'application/json'}
        }).then((response)=> {
            setMoreIsLoading(false)
            return response.json()
        })

        if (loadedArticles.length === 0) {
            setNoMoreArticles(true)
        }

        setPage(page + 1)
        setArticles(articles.concat(loadedArticles))
    }, [fetch, page, articles])

    const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = async function() {
        scrollFunction()

        const scrollValue = getScrollBottom()

        if (scrollValue === 0 && !noMoreArticles && articles.length !== 0) {
                await loadMoreArticles()
        }
    }

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    function getScrollBottom() {
        return document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight;
    }

// When the user clicks on the button, scroll to the top of the document
    function topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    return(
        <>
            <main className={'homepage-main'}>
                <div className={'homepage-main-header'}>
                    {isAuth && <NewPost onCreate={() => {
                        window.location.reload()
                    }}/>}
                <div className={'homepage-account'}>
                    {(isAuth&&userId!==null)&&<Account/>}
                    {loading&&<div>Loading...</div>}
                </div>
                </div>
                <div className={'homepage-main-container'}>
                    <p style={{fontSize:'20px'}}>{t('Recent posts:')}</p>
                    {(articles !==undefined && !loading) &&
                        <ListOfArticles onDelete={() => {
                            setArticles([])
                            fetchAuth()
                        }} articles={articles}/>}
                    {noMoreArticles && <div align={'center'}><p>{t('No more posts...')}</p></div>}
                    <button onClick={topFunction} id={'myBtn'} title={'To top'}>{t('Go to top')}</button>
                    {moreIsLoading && <div align={'center'}><Loader/></div>}
            </div>

            </main>
        </>
    )
}