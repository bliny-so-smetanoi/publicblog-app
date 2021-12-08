import {useContext, useState} from "react";
import Moment from "react-moment";
import Comments from "./Comments";
import {useHttp} from "../hooks/http-hook";
import {AuthContext} from "../context/AuthContext";

export default function Article(props){
    const article = props.article
    const {userId, isAuth}= useContext(AuthContext)
    const {request, loading} = useHttp()
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

    function handleChange(e){
        setNewComment({...newComment,[e.target.name]:e.target.value})
    }

    return(
        <>
            <div onMouseEnter={()=>setButton(true)} onMouseLeave={()=>setButton(false)} className={'homepage-main-article-card'}>
                <div align={'right'}>by: {article.name}</div>
                <div style={{fontSize:'16px'}} align={'right'}><Moment fromNow>{article.date_time}</Moment></div>
                <i style={{fontSize:'20px'}}>{article.title}</i>
                <p>
                    {article.body_text}
                </p>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{minHeight:'30px'}}>
                    {(!loaded&&button)&&
                        <span className={'button-comment'} onClick={loadComments}>&#9662;{!loading&& 'show comments'}{loading&&'loading...'}</span>}
                    </div>
                    {(loaded&&comments.length === 0)
                        && <div><p>No comments added yet...</p></div>}
                    {(loaded)&&
                        <div><span className={'button-comment'} onClick={()=>setLoaded(false)}>&#9652;hide comments</span><div style={{paddingLeft:'25px'}}>
                        <Comments comments={comments}/>
                        </div></div>}
                    <br/>
                    {loaded&&<textarea value={newComment.body_text} disabled={!isAuth} onChange={handleChange} name={'body_text'} style={{resize:'none'}} placeholder={'Write you comments here'} rows={4} cols={9}/>}
                    {loaded&&<button style={{color:'#501B1D',backgroundColor:'white',border:'1px solid #501B1D'}} disabled={!isAuth} onClick={sendComment}>Send comment</button>}
                </div>

            </div>
        </>
    )
}