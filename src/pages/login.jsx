import React, { useState } from 'react'
import LoginComponent from '../components/login'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import FirstLoginPage from '../components/FirstLoginComponnent';
import userService from '../../services/userService';
export default function login() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            const decodedToken = jwtDecode(token)
            setUser(decodedToken.user)
            setProfile(decodedToken.profile)
            
            // Vérifier si c'est la première connexion
            if (decodedToken.firstLogin) {
                navigate('/modification')
                return
            }
            
            if(decodedToken.user.role === "ENSEIGNANT"){
                navigate('/dashboard/enseignant')
            }else if (decodedToken.user.role === "ELEVE"){
                navigate('/dashboard/eleve')
            }else{
                navigate('/dashboard/admin')
            }
        }else{
            return
        }
    },[])
  return (
    <div>
        <LoginComponent/>
    </div>
  )
}
