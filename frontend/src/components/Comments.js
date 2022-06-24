import Comment from "./Comment";

export default function Comments(props){
    const comments = props.comments

    const list = comments.map(comment=> {
        return <Comment comment={comment}/>
    })

    return(
        <>
            {list}
        </>
    )
}