import {useContext, useState} from "react";
import {AuthContext} from "../../../context/AuthContext";
import {useTranslation} from "react-i18next";

export default function ProfilePhoto(props) {
    const {t, i18n} = useTranslation()
    const [image, setImage] = useState(props.image)
    const [show, setShow] = useState(false)
    const [newImage, setNewImage] = useState()
    const {userId} = useContext(AuthContext)
    const [save, setSave] = useState(false)
    const [loading, setLoading] = useState(false)
    const LOCAL = 'http://192.168.1.64:5000/api/files/download/'
    const REMOTE = 'https://publicblogapp.herokuapp.com/api/files/download/'

    async function updatePhoto() {
        setLoading(true)
        const id = JSON.parse(localStorage.getItem('userData'))

        const formData = new FormData()
        formData.append('file', newImage)

        const upload = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        }).then(res=>res.json())

        if (upload) {
            console.log(upload)
            const image = await fetch('/api/auth/profile/photo', {
                method: 'POST',
                body: JSON.stringify({photo: upload.filename}),
                headers: {'Authorization': 'Bearer ' + id['userId'], 'Content-Type': 'application/json'}
            }).then(res=>res.json())

            if (image) {
                const data = await fetch('/api/auth/profile/photo', {
                    method: 'GET',
                    headers: {'Authorization': 'Bearer ' + id['userId']}
                }).then(res=>res.json())

                setImage(data.profile.image)
                setLoading(false)
                props.reload()
            }
        }
    }

    function handleImage(event) {
        setNewImage(event.target.files[0])

        let newUrl = window.URL.createObjectURL(event.target.files[0])
        let imageInput = document.getElementById('profile-image-input')
        imageInput.src = newUrl

        setSave(true)
    }

        return (
            <>
                <div className={'profilepage-profile-photo'}>

                    <div className={'profilepage-profile-photo'} onMouseEnter={() => setShow(!show)} onMouseLeave={() => setShow(!show)}>

                        <img id={'profile-image-input'} className={'profilepage-photo'} src={REMOTE + image}/>

                    {(show && props.editable) &&
                        <div className={'profilepage-photo-hover'}>
                        <label htmlFor={'input-file'}>
                            <input disabled={loading}
                                   id={'input-file'}
                                   name={'file'}
                                   accept={"image/png, image/jpg, image/gif, image/jpeg"}
                                   type={'file'}
                                   onChange={handleImage}/>
                            <div style={{cursor: 'pointer', color: 'white'}}>{t('select photo')}</div>
                        </label>
                    </div>}
                        <br/>
                        {save &&
                            <div align={'center'} style={{fontSize: '15px',
                                cursor: 'pointer',
                                textDecoration: 'underline'}}
                                 onClick={updatePhoto}>
                                {t('save image')}
                            </div>}

                    </div>
                </div>
            </>
        )
    }