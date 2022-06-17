import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserID] = useState()

    const login = useCallback((jwtToken, id)=>{
        setToken(jwtToken)
        setUserID(id)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken
        }))

    }, [])

    const logout = useCallback(()=>{
        setUserID(null)
        setToken(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem(storageName))

        if(data&&data.token){
            login(data.token, data.userId)
        }
        setReady(true)
    },[login])

    return {login, logout, token, userId, ready}
}