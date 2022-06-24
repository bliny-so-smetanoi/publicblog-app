import {useContext, useState} from "react";
import Moment from "react-moment";
import Comments from "./Comments";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";
import {NotificationManager} from "react-notifications";
import {isMobile} from "react-device-detect";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import 'moment/locale/ru'

export default function Article(props){
    const navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const [article, setArticle] = useState(props.article)
    const {userId, isAuth}= useContext(AuthContext)
    const {request, loading} = useHttp()
    const [editPressed, setEditPressed] = useState(false)
    const [imageIsLoading, setImageIsLoading] = useState(true)
    const [showMore, setMore] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [button,setButton] = useState(false)
    const [comments, setComments] = useState([])
    const [moreButton, setMoreButton] = useState(false)
    const [newComment, setNewComment] = useState({
        body_text:''
    })
    const [editBody, setEditBody] = useState({
        title: article.title,
        body_text: article.body_text
    })

    const clientDateNow = new Date(Date.now())
    const clientYear = clientDateNow.getFullYear().toString()
    const clientDateString = `${clientDateNow.getDate()}${clientDateNow.getMonth() + 1}${clientDateNow.getFullYear()}`
    const articleDate = new Date(article.date_time)
    const articleYear = articleDate.getFullYear().toString()
    const articleDateString = `${articleDate.getDate()}${articleDate.getMonth() + 1}${articleDate.getFullYear()}`
    const isToday = clientDateString === articleDateString
    const isCurrentYear = clientYear === articleYear

    async function loadComments(){
        try{
            setButton(false)
            const data = await request(`/api/articles/comments/${article._id}`)
            setComments(data)
            setLoaded(true)
        }catch (e){}
    }

    async function sendComment(){
        try{
            if (newComment.body_text.trim() === '') {
                NotificationManager.error(t('Comment cannot be empty!'))
                return
            }
            const data = await request('/api/articles/comments/create', 'POST',{...newComment,user_id: userId, article_id: article._id})
            setNewComment({body_text:''})
            NotificationManager.success(t('Commented!'))
            await loadComments()
        }catch (e){}
    }

    async function updateArticle() {
        const data = await request(`/api/articles/${article._id}`, 'GET', null, {'Authorization': 'Bearer ' + userId})

        setArticle(data)
    }

    function handleChange(e){
        setNewComment({...newComment,[e.target.name]: e.target.value})
    }

    function handleEditChange(e) {
        setEditBody({...editBody, [e.target.name]: e.target.value})
    }

    async function handleEdit() {
        try {
            if (editBody.title.trim() === '' || editBody.body_text.trim() === '') {
                NotificationManager.error(t('Cannot be empty!'))
                return
            }

            await request('/api/articles/edit', 'PUT', {...editBody, articleId: article._id})

            await updateArticle()
            setEditPressed(false)
            NotificationManager.info(t('Edited'))
        } catch (e) {}
    }

    async function handleDelete() {
        try {
            const data = await fetch(
                '/api/articles/delete/' + article._id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userId}`
                    },
                }
            ).then(res => res.json())

            if (data) {
                NotificationManager.error(t('Post deleted'))
                props.onDelete()
            }
        }catch (e){}
    }
    const LOCAL = 'http://192.168.1.64:5000/api/files/download/'
    const REMOTE = 'https://publicblogapp.herokuapp.com/api/files/download/'

    async function handleLikeClick() {
        if (article.isLiked) {
            const data = await request('/api/articles/like', 'DELETE', {id: article._id, userId})
            if (data) {
                NotificationManager.error(t('Disliked'))
                await updateArticle()
            }
        } else {
            const data = await request('/api/articles/like', 'POST', {id: article._id, userId})
            if (data) {
                NotificationManager.success(t('Liked!'))
                await updateArticle()
            }
        }
    }

    return(
        <>
            <div onMouseEnter={()=>setButton(true)} onMouseLeave={()=>{
                setMoreButton(false)
                setButton(false)
            }} className={'homepage-main-article-card'}>

                <div style={{display: 'flex',
                    justifyContent:'space-between'}}
                     align={'left'}>
                    <span style={{cursor: 'pointer',
                                    display: 'flex',
                        flexDirection: 'row'}}
                          onClick={() =>{
                              const id = JSON.parse(localStorage.getItem('userData'))

                              if (id !== null && id['userId'] === article.user[0]._id) {
                                  navigate('/profile')
                                  return
                              }
                              navigate('/user/' + article.user[0]._id)}}>
                        <div><img width={60} height={60} style={{borderRadius: '50%', marginRight: '15px'}}
                            src={REMOTE + article.user[0].profile.image} alt=""/></div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px'}}>{article.user[0].first_name} {article.user[0].last_name}</div>
                        {article.isAuthor && <b style={{color: '#501B1D', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> {t('you')}</b>}
                    </span>

                    {editPressed &&
                        <div>
                        <span onClick={handleEdit}
                            style={{cursor: 'pointer',
                            fontSize: '30px', marginRight: '20px'}}>
                            &#10003;
                        </span>
                        <span onClick={() => setEditPressed(false)}
                             style={{cursor: 'pointer',
                                 fontSize: '30px'}}>
                            &#10005;
                        </span>
                        </div>}

                    {((button && article.isAuthor && !editPressed) || (isMobile && article.isAuthor && !editPressed)) &&
                        <div onClick={() => setMoreButton(!moreButton)}
                             style={{
                                 position: 'relative',
                                 cursor: 'pointer'}}>
                            <span>
                                <div style={{fontSize: '25px',
                                    height: '5px'}}>...</div>
                            </span>
                            {moreButton &&
                                <span style={{
                                position: 'absolute',
                                zIndex: '1'}}>
                            <span>
                                <button
                                style={{
                                    border: '1px solid lightgray',
                                    backgroundColor: '#501B1D',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '8px'
                                }}
                                onClick={handleDelete}>
                                {t('Delete')}</button>
                            </span>
                                <span>
                                    <button onClick={() => setEditPressed(true)}
                                            style={{
                                                border: '1px solid lightgray',
                                                backgroundColor: '#501B1D',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '8px'
                                            }}>
                                        {t('Edit')}
                                    </button>
                                </span>
                        </span>}

                        </div>}

                    {((article.isAuthor && button) || (isMobile && article.isAuthor))}
                </div>

                <div style={{fontSize:'16px',
                    marginBottom: '10px'}}
                     align={'left'}>
                    {isToday &&
                        <Moment locale={i18n.language} fromNow>{article.date_time}</Moment>}
                    {(!isToday && isCurrentYear) &&
                        <Moment locale={i18n.language} format={'D MMM HH:MM'}>{article.date_time}</Moment>}
                    {(!isCurrentYear && !isToday) &&
                        <Moment locale={i18n.language} format={'D MMM YYYY'}>{article.date_time}</Moment>}
                    {article.edited && <span> <b style={{fontSize: '15px'}}>{t('edited')}</b></span>}
                </div>

                {!editPressed &&
                    <b style={{fontSize:'20px'}}>
                    {article.title}
                    </b>}
                <p style={{marginBottom: '30px'}}>

                    {editPressed && <div style={{display: 'flex', flexDirection: 'column'}}>
                        <input onChange={handleEditChange}
                               value={editBody.title}
                               name={'title'}
                               type={'text'}
                               style={{padding:'5px',
                                   borderTop: '1px solid lightgray',
                                   borderRight: '1px solid lightgray',
                                   borderLeft: '1px solid lightgray',
                                   borderBottom:'none',
                                   outlineStyle: 'none'}}
                                placeholder={'Title'}/>
                        <textarea onChange={handleEditChange}
                                  value={editBody.body_text}
                                  name={'body_text'}
                                  style={{resize:'none',
                                      borderTop: 'none',
                                      borderRight: '1px solid lightgray',
                                      borderLeft: '1px solid lightgray',
                                      borderBottom:'1px solid lightgray',}}
                                    cols={40}
                                    rows={10}
                                    placeholder={'Text'}>
                        </textarea>
                    </div>}

                    {((article.body_text.length <= 1700 || showMore) && !editPressed) &&
                        article.body_text}
                    {((article.body_text.length > 1700 && !showMore ) && !editPressed) &&
                        article.body_text.slice(0, 1700) + '... '}
                    {((article.body_text.length > 1700 && button) && !editPressed) &&
                        <i style={{textDecoration:'underline', cursor: 'pointer'}}
                           onClick={()=>setMore(!showMore)}>
                            {showMore ? t('show less') : t('show more')}</i>}
                </p>
                {article.image &&
                    <div style={{display:'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                    marginBottom: '20px'}}
                                       align={'center'}>
                    {imageIsLoading && <p>loading...</p>}
                    <img className={'article-image'}
                         onLoad={()=>setImageIsLoading(false)}
                         width={'800px'}
                         src={`${REMOTE}${article.image}`}
                         loading={'lazy'}/>
                    </div>}
                <div style={{display:'flex',
                    flexDirection:'column'}}>
                    <div style={{minHeight:'30px',
                        display: 'flex',
                        justifyContent: 'space-between'}}>
                        <span>
                            <button style={{borderRadius: '20px',
                                        border: '1px solid gray',
                                        backgroundColor: '#FFF3F0',
                                        cursor: 'pointer',
                                        paddingRight: '13px',
                                        paddingLeft: '13px',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '70px'}}
                                    disabled={!isAuth || loading}
                            onClick={handleLikeClick}>
                    {!article.isLiked && <span><svg fill={'gray'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.28 3c3.236.001 4.973 3.491 5.72 5.031.75-1.547 2.469-5.021 5.726-5.021 2.058 0 4.274 1.309 4.274 4.182 0 3.442-4.744 7.851-10 13-5.258-5.151-10-9.559-10-13 0-2.676 1.965-4.193 4.28-4.192zm.001-2c-3.183 0-6.281 2.187-6.281 6.192 0 4.661 5.57 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-4.011-3.097-6.182-6.274-6.182-2.204 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248z"/></svg></span>}
                    {article.isLiked && <span><svg fill={'#922025'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg></span>}
                                <span style={{fontSize: '18px'}}>{article.likesCount}</span></button></span>
                        {((!loaded && button) || (isMobile && !loaded)) &&
                            <span className={'button-comment'}
                                  onClick={loadComments}>
                                {!loading && t('show comments ')}
                                {loading &&'loading...'}&#9662;</span>}
                    </div>
                    {(loaded&&comments.length === 0) &&
                        <div align={'center'}
                                style={{fontSize: '15px'}}>{t('No comments added yet...')}</div>}
                    {(loaded) &&
                        <div>
                            {/*<div align={'right'}*/}
                            {/*     className={'button-comment'}*/}
                            {/*       onClick={()=>setLoaded(false)}>hide comments &#9652;</div>*/}
                            <div style={{paddingLeft:'25px'}}>
                        <Comments comments={comments}/>
                        </div></div>}
                    <br/>
                    <div className={'send-comment'}>
                    {(loaded && isAuth) &&
                        <textarea value={newComment.body_text}
                                  disabled={!isAuth}
                                  onChange={handleChange}
                                  name={'body_text'}
                                  style={{resize:'none',
                                  borderTop: 'none',
                                  borderRight: 'none',
                                  borderLeft: 'none',
                                  borderBottom: '2px solid lightgray'}}
                                  placeholder={t('Write your comment here...')}
                                  rows={4}
                                  cols={110}/>}
                    {(loaded && isAuth) &&
                        <button style={{color:'#501B1D',
                        fontSize: '16px',
                        backgroundColor:'white',
                        border:'none', cursor:'pointer',
                        borderTopRightRadius: '15px',
                        borderBottomRightRadius: '15px'}}
                                     disabled={!isAuth}
                                     onClick={sendComment}><i className="arrow right"/></button>}
                    </div>
                </div>


            </div>
        </>
    )
}