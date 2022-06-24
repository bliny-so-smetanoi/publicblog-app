import Reply from "./Reply";

export default function Replies(props) {
    const replies = props.replies
    const list = replies.map(reply => <Reply reply={reply}/>)

    return (
        <>
            {list}
        </>
    )
}