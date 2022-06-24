import {useState} from "react";
import {NotificationManager} from "react-notifications";
import {useTranslation} from "react-i18next";

export default function ProfileInfo(props) {
    const {t, i18n} = useTranslation()
    const [info, setInfo] = useState(props.info)
    const [editPressed, setEditPressed] = useState(false)
    const [editBody, setEditBody] = useState({
        description: info.profile.description,
        first_name: info.first_name,
        last_name: info.last_name
    })

    async function handleAcceptClick() {
        try {
            if (editBody.first_name.trim() === '' || editBody.last_name.trim() === '') {
                NotificationManager.error(t('Cannot be empty!'))
                return
            }

            const id = JSON.parse(localStorage.getItem('userData'))

            await fetch('/api/auth/profile/edit', {
                method: 'PUT',
                body: JSON.stringify(editBody),
                headers: {'Authorization': 'Bearer ' + id['userId'],
                    'Content-Type': 'application/json'}
            }).then(res=>res.json())
            NotificationManager.info(t('Edited'))
            props.reload()
            setEditPressed(false)
        } catch (e) {
            console.log(e)
        }
    }

    function handleEditChange(e) {
        setEditBody({...editBody, [e.target.name]: e.target.value})
    }

    return (
        <>

            <div style={{border: '1px solid lightgray',
                padding: '10px',
                borderRadius: '10px'}}>
                <div style={{display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'}}>
                    <span>
                        {editPressed &&
                            <div>
                                <input onChange={handleEditChange}
                                       style={{padding:'5px',
                                    border: '1px solid lightgray',
                                    outlineStyle: 'none'}}
                                       type={'text'}
                                        placeholder={t('First name')}
                                        value={editBody.first_name}
                                        name={'first_name'}/>
                                <input onChange={handleEditChange}
                                       style={{padding:'5px',
                                    border: '1px solid lightgray',
                                    outlineStyle: 'none',
                                    marginLeft: '20px'}}
                                       type={'text'}
                                       placeholder={t('Last name')}
                                        value={editBody.last_name}
                                       name={'last_name'}/>
                            </div>}
                        {!editPressed && <span>
                            <span>{info.first_name}</span>
                            <span> {info.last_name}</span>
                        </span>}
                    </span>
                    {(!editPressed && props.editable) &&
                        <span onClick={() => setEditPressed(true)}
                            style={{cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '18px'}}>
                            {t('edit')}
                        </span>}
                    {editPressed &&
                        <div>
                            <span onClick={handleAcceptClick}
                                  style={{cursor: 'pointer',
                                      fontSize: '30px', marginRight: '20px'}}>
                                &#10003;
                            </span>
                            <span onClick={() =>{
                                setEditBody({
                                    first_name: info.first_name,
                                    last_name: info.last_name,
                                    description: info.profile.description
                                })
                                setEditPressed(false)}}
                                  style={{cursor: 'pointer',
                                      fontSize: '30px'}}>
                                &#10005;
                            </span>
                        </div>}
                </div>
                <br/>

                <div style={{fontSize: '15px'}}>
                    {t('Description')}:
                </div>

                {!editPressed &&
                    <div>
                        {info.profile.description}
                    </div>}
                {editPressed &&
                    <textarea onChange={handleEditChange}
                        style={{resize:'none',
                        borderTop: 'none',
                        borderRight: '1px solid lightgray',
                        borderLeft: '1px solid lightgray',
                        borderBottom:'1px solid lightgray',}}
                    cols={40} rows={10}
                    placeholder={t('Write here something about you...')}
                    value={editBody.description} name={'description'}>
                    </textarea>}
            </div>

        </>
    )
}