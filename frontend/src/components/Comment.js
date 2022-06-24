import Moment from "react-moment";
import Replies from "./Replies";
import {useContext, useState} from "react";
import {useAuth} from "../hooks/auth-hook";
import {useHttp} from "../hooks/http-hook";
import {NotificationManager} from "react-notifications";
import {isMobile} from "react-device-detect";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import 'moment/locale/ru'
export default function Comment(props) {
    const navigate = useNavigate()
    const {t, i18n} = useTranslation()
    const [comment, setComment] = useState(props.comment)
    const {request, loading} = useHttp()
    const {userId} = useAuth()
    const {isAuth} = useContext(AuthContext)
    const [replyButtonPressed, setReplyButton] = useState(false)
    const [newReply, setNewReply] = useState({
        body_text: ''
    })
    const [buttonShow, setButtonShow] = useState(false)

    function handleChange(e) {
        setNewReply({body_text: e.target.value})
        console.log(newReply.body_text)
    }

    async function reload() {
        try {
            const data = await request('/api/articles/comments/comment/' + comment._id)

            setComment(data)
        }catch (e){}
    }

    async function sendReply() {
        try {
            if(newReply.body_text.trim() === '') {
                NotificationManager.error(t('Reply cannot be empty!'))
                return
            }

            await request('/api/articles/comments/reply', 'POST',
                {commentId: comment._id,
                user: userId,
                receiver: comment.user_id,
                body_text: newReply.body_text})

            await reload()
            setNewReply({body_text: ''})
            NotificationManager.success(t('Replied'))
        }catch (e) {}
    }
    const LOCAL = 'http://192.168.1.64:5000/api/files/download/'
    const REMOTE = 'https://publicblogapp.herokuapp.com/api/files/download/'

    const clientDateNow = new Date(Date.now())
    const clientYear = clientDateNow.getFullYear().toString()
    const clientDateString = `${clientDateNow.getDate()}${clientDateNow.getMonth() + 1}${clientDateNow.getFullYear()}`
    const articleDate = new Date(comment.date_time)
    const articleYear = articleDate.getFullYear().toString()
    const articleDateString = `${articleDate.getDate()}${articleDate.getMonth() + 1}${articleDate.getFullYear()}`
    const isToday = clientDateString === articleDateString
    const isCurrentYear = clientYear === articleYear

    return (
        <>
            <div onMouseEnter={() => setButtonShow(true)} onMouseLeave={() => setButtonShow(false)} className={'homepage-main-article-comment'} key={comment._id}>
                <div onClick={() =>{
                    const id = JSON.parse(localStorage.getItem('userData'))
                    if (id !== null && id['userId'] === comment.user._id) {
                        navigate('/profile')
                        return
                    }
                    navigate('/user/' + comment.user._id)}}
                    style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                <span>
                    <img width={60} height={60} style={{borderRadius: '50%', marginRight: '15px'}}
                           src={REMOTE + comment.user.profile.image} alt=""/>
                </span>

                <span>
                <p style={{cursor: 'pointer'}}>

                    {comment.user.first_name} {comment.user.last_name}
                </p>
                    </span>
                </div>
                <p>{comment.body_text}</p>
                <p style={{fontSize: '14px', color: 'grey'}}>
                    {isToday && <Moment locale={i18n.language} fromNow>{comment.date_time}</Moment> }
                    {(!isToday && isCurrentYear) && <Moment locale={i18n.language} format={'D MMM HH:MM'}>{comment.date_time}</Moment>}
                    {(!isCurrentYear && !isToday) && <Moment locale={i18n.language} format={'D MMM YYYY'}>{comment.date_time}</Moment>}
                    {((buttonShow && isAuth) || (isMobile && isAuth)) && <span> <b style={{textDecoration: 'underline',
                                                        cursor: 'pointer'}}
                                             onClick={()=>setReplyButton(true)}>{t('reply')}</b></span>}
                </p>
            </div>
            {Object.keys(comment.replies[0]).length !== 0 && <Replies replies={comment.replies}/>}
            {replyButtonPressed && <div className={'send-comment reply'}>
                        <textarea value={newReply.body_text}
                                  onChange={handleChange}
                                  name={'body_text'}
                                  style={{resize:'none',
                                      borderTop: 'none',
                                      borderRight: 'none',
                                      borderLeft: 'none',
                                      borderBottom: '2px solid lightgray',
                                  fontSize: '15px'}}
                                  disabled={loading}
                                  placeholder={`${t('Reply to')} ${comment.name}`}
                                  rows={4}
                                  cols={110}/>
                <button style={{color:'#501B1D',
                    fontSize: '16px',
                    backgroundColor:'white',
                    border:'none', cursor:'pointer',
                    borderTopRightRadius: '15px',
                    borderBottomRightRadius: '15px'}}
                        disabled={loading}
                        onClick={sendReply}><i className="arrow right"/></button>
            </div>}
        </>
        )
}