import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {useAuth} from "./hooks/auth-hook";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

export default function App() {
    const {token,login,logout,userId} = useAuth()

    const isAuth = !!token

    return (
        <>
            <AuthContext.Provider value={{
                token, login, logout, userId, isAuth
            }}>

                <BrowserRouter>

                    <Navbar/>
                    <Routes>
                        <Route path={'/'} element={<HomePage/>}/>
                        <Route path={'/profile'} element={<ProfilePage/>}/>
                        <Route path={'*'} element={<HomePage/>}/>
                    </Routes>

                    <Footer/>
                </BrowserRouter>

            </AuthContext.Provider>
            </>
            )
}

