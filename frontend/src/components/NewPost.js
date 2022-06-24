import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http-hook";
import {NotificationManager} from "react-notifications";
import {useTranslation} from "react-i18next";

export default function NewPost(props){

    const {userId,isAuth} = useContext(AuthContext)
    const {request} = useHttp()
    const [sending, setSending] = useState(false)
    const {t, i18n} = useTranslation()

    const [form,setForm] = useState({
        body_text: '',
        title: '',
    })
    const [image, setImage] = useState(null)

    async function createPost(){
        try{
            if (form.body_text.trim() === '' || form.title.trim() === '') {
                NotificationManager.error(t('Title and text cannot be empty!'))
                return
            }

            setSending(true)

            const formData = new FormData()
            formData.append('file', image)

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            })

            const dataImage = await response.json()

            const data = await request('/api/articles/create', 'POST',{...form, author:userId, image: dataImage.filename})
            props.onCreate()
            setForm({
                body_text: '',
                title: '',
            })
            handleCancel()
            NotificationManager.success(t('Posted!'))
            setSending(false)
        }catch (e){}
    }

    function handleChange(e){
        setForm({...form, [e.target.name]:e.target.value})
    }

    function handleImage(event) {
        setImage(event.target.files[0])
        let newUrl = window.URL.createObjectURL(event.target.files[0])
        let imageInput = document.getElementById('image-input')
        imageInput.src = newUrl
    }

    function handleCancel() {
        setImage(null)
        let input = document.getElementById('input-file')
        input.value = ''
        let imageInput = document.getElementById('image-input')
        imageInput.src = ''
    }

    return(
        <>
            <div className={'homepage-main-create'}
                 style={{display:'flex',
                        flexDirection:'column'}}>
                <p style={{display: 'flex',
                    color:'#501B1D',
                    justifyContent:'space-between',
                    fontSize:'20px'}}>
                    {isAuth&& t('Create new post:')}
                    {!isAuth&&'In order to create post you need to log in'}
                    <button className={'create-button'}
                            onClick={createPost}
                            disabled={sending}>{t('Post')}</button></p>
                <input style={{padding:'5px',
                    borderTop: '1px solid lightgray',
                    borderRight: '1px solid lightgray',
                    borderLeft: '1px solid lightgray',
                    borderBottom:'none',
                    outlineStyle: 'none'}}
                       disabled={sending}
                       onChange={handleChange}
                       name={'title'}
                       type={'text'}
                       placeholder={t('Title')} value={form.title}/>
                <textarea disabled={sending}
                          onChange={handleChange}
                          name={'body_text'}
                          value={form.body_text}
                          placeholder={t('Write your text here')}
                          style={{resize:'none',
                              borderTop: 'none',
                              borderRight: '1px solid lightgray',
                              borderLeft: '1px solid lightgray',
                              borderBottom:'1px solid lightgray',}}
                          cols={40}
                          rows={10}/>
                <label className={'homepage-input-label'}
                       htmlFor="input-file">
                <div className={'homepage-input-container'}>
                        <input disabled={sending}
                               id={'input-file'}
                               name={'file'}
                               accept={"image/png, image/jpg, image/gif, image/jpeg"}
                               type={'file'}
                               onChange={handleImage}/>
                        {image === null &&
                            <span style={{fontSize:'15px',
                            color: 'gray'}}
                                  id={'preview-images'}>{t('select image')}</span>}
                        <img className={'input-image'}
                             width={'500'}
                             id={'image-input'}
                             src={''}  alt={''}/>
                </div>
                </label>
                {image !== null &&
                    <button style={{backgroundColor: 'white',
                        border:'1px solid lightgray',
                        cursor:'pointer',
                        marginTop: '10px'}}
                            onClick={handleCancel}>{t('discard image')}</button>}
            </div>
        </>
    )
}