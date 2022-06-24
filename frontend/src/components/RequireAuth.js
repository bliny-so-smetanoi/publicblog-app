import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {Navigate} from "react-router-dom";


export default function RequireAuth({children}) {
    const {isAuth} = useContext(AuthContext)

    return isAuth ? children :
        // <Navigate to={'/'}/>
        <div align={'center'} style={{
        color: '#501B1D', fontSize: '40px', height: '800px'
    }}>
        401 error
    </div>
}