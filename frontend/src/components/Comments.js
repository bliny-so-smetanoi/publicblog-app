import Moment from "react-moment";

export default function Comments(props){
    const comments = props.comments
    const list = comments.map(comment=> {

        const clientDateNow = new Date(Date.now())
        const clientYear = clientDateNow.getFullYear().toString()
        const clientDateString = `${clientDateNow.getDate()}${clientDateNow.getMonth() + 1}${clientDateNow.getFullYear()}`
        const articleDate = new Date(comment.date_time)
        const articleYear = articleDate.getFullYear().toString()
        const articleDateString = `${articleDate.getDate()}${articleDate.getMonth() + 1}${articleDate.getFullYear()}`
        const isToday = clientDateString === articleDateString
        const isCurrentYear = clientYear === articleYear

        return <div className={'homepage-main-article-comment'} key={comment._id}>
            <p>{comment.name}</p>
            <p>{comment.body_text}</p>
            <p style={{fontSize: '14px', color: 'grey'}}>
                {isToday && <Moment fromNow>{comment.date_time}</Moment> }
                {(!isToday && isCurrentYear) && <Moment format={'D MMM HH:MM'}>{comment.date_time}</Moment>}
                {(!isCurrentYear && !isToday) && <Moment format={'D MMM YYYY'}>{comment.date_time}</Moment>}
            </p>
        </div>
    })


    return(
        <>
            {list}
        </>
    )
}