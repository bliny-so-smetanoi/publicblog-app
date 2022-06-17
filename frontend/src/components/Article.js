import {useContext, useState} from "react";
import Moment from "react-moment";
import Comments from "./Comments";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";
import ReactTooltip from "react-tooltip";

export default function Article(props){
    const [article, setArticle] = useState(props.article)
    const {userId, isAuth}= useContext(AuthContext)
    const {request, loading} = useHttp()
    const [showMore, setMore] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [button,setButton] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState({
        body_text:''
    })

    async function loadComments(){
        try{
            const data = await request(`/api/articles/comments/${article._id}`)
            setComments(data)
            setLoaded(true)
        }catch (e){}
    }

    async function sendComment(){
        try{
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
                await updateArticle()
            }
        } else {
            const data = await request('/api/articles/like', 'POST', {id: article._id, userId})
            if (data) {
                await updateArticle()
            }
        }
    }

    return(
        <>
            <div onMouseEnter={()=>setButton(true)} onMouseLeave={()=>setButton(false)} className={'homepage-main-article-card'}>
                {article.likesCount !== 0 && <div>
                        {article.likesCount} {article.likesCount > 1 ? 'people' : 'person'} liked this post
                    </div>}
                <div align={'right'}>by: {article.name}</div>
                <div style={{fontSize:'16px'}} align={'right'}><Moment fromNow>{article.date_time}</Moment></div>
                <b style={{fontSize:'20px'}}>{article.title}</b>
                <p>
                    {(article.body_text.length <= 1700 || showMore) && article.body_text}
                    {(article.body_text.length > 1700 && !showMore )&& article.body_text.slice(0, 1700) + '... '}
                    {(article.body_text.length > 1700) && <i style={{textDecoration:'underline'}} onClick={()=>setMore(!showMore)}>{showMore ? 'show less' : 'show more'}</i>}
                </p>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{minHeight:'30px', display: 'flex', justifyContent: 'space-between'}}>
                    {(!loaded&&button)&&
                        <span className={'button-comment'} onClick={loadComments}>&#9662;{!loading&& 'show comments'}{loading&&'loading...'}</span>}
                        {(!loaded&&button)&& <span><ReactTooltip/><button data-tip={`Press to ${article.isLiked ? 'unlike' : 'like'}`} style={{borderRadius: '15px', border: '1px solid black', backgroundColor: 'white'}} disabled={!isAuth} onClick={handleLikeClick}>
                    {!article.isLiked && 'Like ♥'}
                    {article.isLiked && 'Liked ❤️'}
                        </button></span>}
                    </div>
                    {(loaded&&comments.length === 0)
                        && <div align={'center'} style={{fontSize: '15px'}}>No comments added yet...</div>}
                    {(loaded)&&
                        <div><span className={'button-comment'} onClick={()=>setLoaded(false)}>&#9652;hide comments</span><div style={{paddingLeft:'25px'}}>
                        <Comments comments={comments}/>
                        </div></div>}
                    <br/>
                    <div className={'send-comment'}>
                    {loaded&&<textarea value={newComment.body_text} disabled={!isAuth} onChange={handleChange} name={'body_text'} style={{resize:'none', borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px'}} placeholder={'Write you comments here'} rows={4} cols={95}/>}
                    {loaded&&<button style={{color:'#501B1D',fontSize: '16px',backgroundColor:'white',border:'1px solid #501B1D', borderTopRightRadius: '15px', borderBottomRightRadius: '15px'}} disabled={!isAuth} onClick={sendComment}>send comment</button>}
                    </div>
                </div>

            </div>
        </>
    )
}