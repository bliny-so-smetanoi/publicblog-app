import Moment from "react-moment";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import 'moment/locale/ru'
export default function Reply(props) {
    const LOCAL = 'http://192.168.1.64:5000/api/files/download/'
    const REMOTE = 'https://publicblogapp.herokuapp.com/api/files/download/'

    const {t, i18n} = useTranslation()
    const reply = props.reply
    const navigate = useNavigate()
    const clientDateNow = new Date(Date.now())
    const clientYear = clientDateNow.getFullYear().toString()
    const clientDateString = `${clientDateNow.getDate()}${clientDateNow.getMonth() + 1}${clientDateNow.getFullYear()}`
    const articleDate = new Date(reply.date_time)
    const articleYear = articleDate.getFullYear().toString()
    const articleDateString = `${articleDate.getDate()}${articleDate.getMonth() + 1}${articleDate.getFullYear()}`
    const isToday = clientDateString === articleDateString
    const isCurrentYear = clientYear === articleYear

    return (
        <>
            <div className={'homepage-main-article-comment reply'} key={reply._id}>
                <div onClick={() =>{
                    const id = JSON.parse(localStorage.getItem('userData'))
                    if (id !== null && id['userId'] === reply.sender._id) {
                        navigate('/profile')
                        return
                    }
                    navigate('/user/' + reply.sender._id)}}
                    style={{display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
                    <span>
                    <img width={40} height={40} style={{borderRadius: '50%', marginRight: '15px'}}
                         src={REMOTE + reply.sender.profile.image} alt=""/>
                </span>
                <p style={{cursor: 'pointer'}}>
                    {reply.sender.first_name} {reply.sender.last_name}
                </p>
                </div>
                <p style={{cursor: 'pointer'}}
                    onClick={() =>{
                    const id = JSON.parse(localStorage.getItem('userData'))
                    if (id !== null && id['userId'] === reply.receiver._id) {
                        navigate('/profile')
                        return
                    }
                    navigate('/user/' + reply.receiver._id)}}>
                    <span
                    style={{color: 'gray'}}>{reply.receiver.first_name} {reply.receiver.last_name}
                    </span>, {reply.body_text}
                </p>
                <p style={{fontSize: '14px', color: 'grey'}}>
                    {isToday && <Moment locale={i18n.language} fromNow>{reply.date_time}</Moment>}
                    {(!isToday && isCurrentYear) && <Moment locale={i18n.language} format={'D MMM HH:MM'}>{reply.date_time}</Moment>}
                    {(!isCurrentYear && !isToday) && <Moment locale={i18n.language} format={'D MMM YYYY'}>{reply.date_time}</Moment>}
                </p>
            </div>
        </>
    )
}