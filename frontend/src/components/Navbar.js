import {useContext, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Modal from '../components/Modal'
import {AuthContext} from "../context/AuthContext";
import profilePic from './profile-icon-png-black-196391.png'
import {useTranslation} from "react-i18next";
import {NotificationManager} from "react-notifications";

export default function Navbar(){
    const navigate = useNavigate()
    const {isAuth, logout} = useContext(AuthContext)
    const {t, i18n} = useTranslation()
    const [show, setShow] = useState(false)

    function logoutHandler(){
        logout()
        window.location.reload()
    }

    if(isAuth){
        return(
            <>
                <nav className={'navbar-main'}>
                    <div className={'navbar-block'}>
                        <div>
                            <button className={'lang-button'} onClick={() => {
                                i18n.changeLanguage('en', (err, t) => {
                                    if (err) return console.log('noth')
                                    localStorage.setItem('lang', 'en')
                                    NotificationManager.info('Switched to english')
                                })
                            }}>eng</button>
                        <button className={'lang-button'} onClick={() => {
                            i18n.changeLanguage('ru', (err, t) => {
                                if (err) return console.log('noth')
                                localStorage.setItem('lang', 'ru')
                                NotificationManager.info('Переключено на русский')
                            })
                        }}>рус</button>

                        </div>
                        <NavLink style={{textDecoration:'none',
                            color:'#501B1D',
                            fontSize: '25px'}} to={'/'}><b>{t('Public Blog App')}</b></NavLink>
                        <div>
                        <span>
                            <NavLink to={'/profile'}>
                            <img style={{marginRight: '30px',width: '30px', height: '30px'}} src={profilePic}/>
                                </NavLink>
                        </span>

                        <button style={{borderRadius:'5px',
                            border:'1px solid #501B1D',
                            color:'#501B1D',
                            backgroundColor:'white',
                            cursor: 'pointer'}}
                                onClick={logoutHandler}>{t('Log out')}</button>
                        </div>
                    </div>
                </nav>
            </>
        )
    }

    return(
        <>
            <nav className={'navbar-main'}>
                <div className={'navbar-block'}>
                    <div>
                    <button className={'lang-button'} onClick={() => {
                        i18n.changeLanguage('en', (err, t) => {
                            if (err) return console.log('noth')
                            localStorage.setItem('lang', 'en')
                            NotificationManager.info('Switched to english')
                        })
                    }}>eng</button>
                    <button className={'lang-button'} onClick={() => {
                        i18n.changeLanguage('ru', (err, t) => {
                            if (err) return console.log('noth')
                            localStorage.setItem('lang', 'ru')
                            NotificationManager.info('Переключено на русский')
                        })
                    }}>рус</button>

                </div>
                    <NavLink style={{textDecoration:'none',
                        color:'#501B1D',
                        fontSize: '25px'}} to={'/'}><b>{t('Public Blog App')}</b></NavLink>
                    <button style={{borderRadius:'5px',
                        border:'1px solid #501B1D',
                        color:'#501B1D',
                        backgroundColor:'white',
                        cursor: 'pointer'}}
                            onClick={()=>setShow(true)}>{t('Log in')}</button>
                </div>
            </nav>
            <Modal show={show}
                   onClose={()=>setShow(false)}/>
        </>
    )
}