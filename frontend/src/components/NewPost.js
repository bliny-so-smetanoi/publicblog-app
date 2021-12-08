import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http-hook";

export default function NewPost(props){

    const {userId,isAuth} = useContext(AuthContext)
    const {request} = useHttp()
    const [form,setForm] = useState({
        body_text: '',
        title: '',
    })

    async function createPost(){
        try{
            const data = await request('/api/articles/create', 'POST',{...form, author:userId})
            props.onCreate()
            setForm({
                body_text: '',
                title: '',
            })
        }catch (e){}
    }

    function handleChange(e){
        setForm({...form, [e.target.name]:e.target.value})
    }

    return(
        <>
            <div className={'homepage-main-create'} style={{display:'flex',flexDirection:'column', width:'60%'}}>
                <p style={{display: 'flex',color:'#501B1D', justifyContent:'space-between',fontSize:'20px'}}>{isAuth&&'Create new post:'}{!isAuth&&'In order to create post you need to log in'}<button style={{color:'#501B1D',backgroundColor:'white',border:'1px solid #501B1D',borderRadius:'5px'}} onClick={createPost} disabled={!isAuth}>Create post</button></p>
                <input style={{padding:'5px',outlineColor:'#501B1D'}} disabled={!isAuth} onChange={handleChange} name={'title'} type={'text'} placeholder={'Title'} value={form.title}/>
                <textarea disabled={!isAuth} onChange={handleChange} name={'body_text'} value={form.body_text} placeholder={'Write your text here'} style={{resize:'none'}} cols={40} rows={10}/>
            </div>
        </>
    )
}