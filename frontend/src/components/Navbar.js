import {useContext, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Modal from '../components/Modal'
import {AuthContext} from "../context/AuthContext";

export default function Navbar(){
    const navigate = useNavigate()
    const {isAuth, logout} = useContext(AuthContext)

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
                        <NavLink style={{textDecoration:'none',color:'white', fontSize: '25px'}} to={'/'}><b>Public Blog App</b></NavLink>
                        <button style={{borderRadius:'5px',border:'1px solid #501B1D',color:'#501B1D',backgroundColor:'white'}} onClick={logoutHandler}>Log out</button>
                    </div>
                </nav>
            </>
        )
    }

    return(
        <>
            <nav className={'navbar-main'}>
                <div className={'navbar-block'}>
                    <NavLink style={{textDecoration:'none',color:'white',fontSize: '25px'}} to={'/'}><b>Public Blog App</b></NavLink>
                    <button style={{borderRadius:'5px',border:'1px solid #501B1D',color:'#501B1D',backgroundColor:'white'}} onClick={()=>setShow(true)}>Log in</button>
                </div>
            </nav>
            <Modal show={show} onClose={()=>setShow(false)}/>
        </>
    )
}