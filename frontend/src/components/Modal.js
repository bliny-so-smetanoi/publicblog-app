import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http-hook";
import ReactTooltip from "react-tooltip";
import Loader from "./Loader";

export default function Modal(props){
    const auth = useContext(AuthContext)

    const [success, setSuccess] = useState(false)
    const [warning,setWarning] = useState(false)
    const [registrationOpen, setReg] = useState(false)
    const {loading, request, error, clearError,messages,clearMessages} = useHttp()
    const [msgWarning, setMsqWarning] = useState(null)
    const [form,setForm]=useState({
        email:'',
        password:''
    })
    const [regForm, setRegForm] = useState({
        email:'',
        password: '',
        first_name: '',
        last_name: ''
    })

    useEffect(()=>{
        if(messages === null || messages === undefined) return

        const listOfErrors = messages.map(msg=>{

            return (
                <>
                    <div key={msg.index}>{msg.msg}</div>
                </>)
        })

        setMsqWarning(listOfErrors)
    },[messages,clearMessages])

    useEffect(()=>{
        if(error === null) return

        setWarning(true)

    },[error,clearError])

    async function loginHandler(){
        try{
            if(form.password === '' || form.email ==='') return

            setWarning(true)

            const data = await request('/api/auth/login','POST',{...form})
            auth.login(data.token, data.userId)

            props.onClose()
        }catch (e){}
    }

    async function registerHandler(){
        try{

            if(error !== null) clearAllErrorsAndMessages()

            const data = await request('/api/auth/register','POST',{...regForm})
            setSuccess(true)

        }catch (e){}
    }

    function changeHandler(e){
        setForm({...form,[e.target.name]:e.target.value.trim()})
    }

    function changeRegHandler(e){
        setRegForm({...regForm,[e.target.name]:e.target.value.trim()})
    }

    function loginFinish(){
        setReg(false)
        setSuccess(false)
    }

    function clearAllErrorsAndMessages(){
        setMsqWarning(null)
        clearError()
    }

    if(!props.show) return null
    return(
        <>
            <div className={'modal'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <h3 style={{color:"#501B1D"}}>{registrationOpen?'Sign up':'Log in'}</h3>
                        {loading && <Loader/>}
                        <span  onClick={props.onClose}>&#10005;</span>
                    </div>
                    <div className={'modal-body'}>
                        {(registrationOpen && !success) &&<div>
                            <div onClick={clearAllErrorsAndMessages}><button onClick={()=>setReg(!registrationOpen)}>&#8617;</button></div>
                            <div align={'center'}>
                                {msgWarning !==null && msgWarning}
                            <div>
                                <ReactTooltip/>
                                <input data-tip={'email should be in format example@mail.com'} className={'signup-input'} placeholder={'Email'} type={'text'} name={'email'} value={regForm.email} onChange={changeRegHandler}/>
                            </div>
                            <div>
                                <ReactTooltip/>
                                <input data-tip={'password should be at least 8 characters'} className={'signup-input'} placeholder={'Password'} type={'password'} name={'password'} value={regForm.password} onChange={changeRegHandler}/>
                            </div>
                            <div>
                                <ReactTooltip/>
                                <input data-tip={'first name should be filled'} className={'signup-input'} placeholder={'First name'} type={'text'} name={'first_name'} value={regForm.first_name} onChange={changeRegHandler}/>
                            </div>
                            <div>
                                <ReactTooltip/>
                                <input data-tip={'last name should be filled'} className={'signup-input'} placeholder={'Last name'} type={'text'} name={'last_name'} value={regForm.last_name} onChange={changeRegHandler}/>
                            </div>
                                <br/>
                                {(warning && !loading) && <div align={'center'} style={{color:'darkred'}}><p>{error}</p></div>}
                            <div align={'center'}>
                                <button className={'signup-button'} onClick={registerHandler}>Register</button>
                            </div>
                            </div>
                        </div>}
                        {success&& <div><p>You registered, in order to log in, please press this button <button onClick={loginFinish}>Log in</button></p></div>}
                        {!registrationOpen&&<div align={'center'}><div>
                            <div style={{marginBottom:'5px'}} onClick={clearAllErrorsAndMessages}>
                                <input className={'login-input'} placeholder={'Email'} type={'text'} name={'email'} value={form.email} onChange={changeHandler}/>
                            </div>
                            <div onClick={clearAllErrorsAndMessages}>
                                <input className={'login-input'} placeholder={'Password'} type={'password'} name={'password'} value={form.password} onChange={changeHandler}/>
                            </div>
                            <div>
                                {warning && <div style={{color:'darkred'}}><p>{error}</p></div>}
                                {msgWarning !==null && msgWarning}
                            </div>
                        </div>
                        <div>
                            <p onClick={clearAllErrorsAndMessages}>Do not have account yet? <span style={{textDecoration: 'underline',color:'#501B1D'}} onClick={()=>setReg(!registrationOpen)}>Sign up</span>.</p>
                        </div>
                            <button className={'login-button'} onClick={loginHandler}>Enter</button></div>}
                    </div>
                    <div className={'modal-footer'}>

                    </div>
                </div>
            </div>
        </>
    )
}