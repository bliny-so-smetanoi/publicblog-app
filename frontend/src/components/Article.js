import {useContext, useState} from "react";
import Moment from "react-moment";
import Comments from "./Comments";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";
import ReactTooltip from "react-tooltip";
import {NotificationManager} from "react-notifications";

export default function Article(props){
    const [article, setArticle] = useState(props.article)
    const {userId, isAuth}= useContext(AuthContext)
    const {request, loading} = useHttp()
    const [imageIsLoading, setImageIsLoading] = useState(true)
    const [showMore, setMore] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [button,setButton] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState({
        body_text:''
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
            const data = await request(`/api/articles/comments/${article._id}`)
            setComments(data)
            setLoaded(true)
        }catch (e){}
    }

    async function sendComment(){
        try{
            if (newComment.body_text.trim() === '') {
                NotificationManager.error('Comment cannot be empty!')
                return
            }
            const data = await request('/api/articles/comments/create', 'POST',{...newComment,user_id: userId, article_id: article._id})
            setNewComment({body_text:''})
            await loadComments()
        }catch (e){}
    }

    async function updateArticle() {
        const data = await request(`/api/articles/${article._id}`, 'GET', null, {'Authorization': 'Bearer ' + userId})

        setArticle(data)
    }

    function handleChange(e){
        setNewComment({...newComment,[e.target.name]:e.target.value})
    }

    async function handleLikeClick() {
        if (article.isLiked) {
            const data = await request('/api/articles/like', 'DELETE', {id: article._id, userId})
            if (data) {
                NotificationManager.error('Disliked')
                await updateArticle()
            }
        } else {
            const data = await request('/api/articles/like', 'POST', {id: article._id, userId})
            if (data) {
                NotificationManager.success('Liked!')
                await updateArticle()
            }
        }
    }

    return(
        <>
            <div onMouseEnter={()=>setButton(true)} onMouseLeave={()=>setButton(false)} className={'homepage-main-article-card'}>

                <div style={{display: 'flex',
                    justifyContent:'space-between'}}
                     align={'left'}> <span> {article.name}
                    {article.author === userId && <b style={{color: '#501B1D'}}>you</b>} </span>
                    {article.likesCount !== 0 && <span style={{fontSize: '16px'}}>
                        {/*{article.likesCount} {article.likesCount > 1 ? 'people' : 'person'} liked this*/}
                    </span>}
                </div>
                <div style={{fontSize:'16px',
                    marginBottom: '10px'}}
                     align={'left'}>
                    {isToday &&
                        <Moment fromNow>{article.date_time}</Moment>}
                    {(!isToday && isCurrentYear) &&
                        <Moment format={'D MMM HH:MM'}>{article.date_time}</Moment>}
                    {(!isCurrentYear && !isToday) &&
                        <Moment format={'D MMM YYYY'}>{article.date_time}</Moment>}
                </div>
                <b style={{fontSize:'20px'}}>{article.title}</b>
                <p style={{marginBottom: '30px'}}>
                    {(article.body_text.length <= 1700 || showMore) &&
                        article.body_text}
                    {(article.body_text.length > 1700 && !showMore ) &&
                        article.body_text.slice(0, 1700) + '... '}
                    {(article.body_text.length > 1700 && button) &&
                        <i style={{textDecoration:'underline'}}
                           onClick={()=>setMore(!showMore)}>
                            {showMore ? 'show less' : 'show more'}</i>}
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
                         src={`https://publicblogappqazaqstan.herokuapp.com/api/files/download/${article.image}`}
                         loading={'lazy'}/> </div>}
                <div style={{display:'flex',
                    flexDirection:'column'}}>
                    <div style={{minHeight:'30px',
                        display: 'flex',
                        justifyContent: 'space-between'}}>
                        <span><ReactTooltip/>
                            <button data-tip={`Press to ${article.isLiked ? 'unlike' : 'like'}`}
                                    style={{borderRadius: '20px',
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
                        {(!loaded&&button) &&
                            <span className={'button-comment'}
                                  onClick={loadComments}>
                                {!loading && 'show comments '}
                                {loading &&'loading...'}&#9662;</span>}
                    </div>
                    {(loaded&&comments.length === 0) &&
                        <div align={'center'}
                                style={{fontSize: '15px'}}>No comments added yet...</div>}
                    {(loaded) &&
                        <div><div align={'right'} className={'button-comment'}
                                   onClick={()=>setLoaded(false)}>hide comments &#9652;</div>
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
                                  placeholder={'Write your comment here...'}
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