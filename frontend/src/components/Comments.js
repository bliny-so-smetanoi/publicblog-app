import Moment from "react-moment";

export default function Comments(props){
    const comments = props.comments

    const list = comments.map(comment=>
        <div className={'homepage-main-article-comment'} key={comment._id}>
            <p>{comment.name}</p>
            <p>{comment.body_text}</p>
            <p style={{fontSize:'14px',color:'grey'}}><Moment fromNow>{comment.date_time}</Moment></p>
        </div>
    )


    return(
        <>
            {list}
        </>
    )
}