import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import FirstLoginComponnent from '../components/FirstLoginComponnent'
import { useNavigate } from 'react-router-dom'
import userService from '../../services/userService'

export default function FirstLogin() {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [isEnseignant, setIsEnseignant] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
        }
        const decodedToken = jwtDecode(token)
        setUser(decodedToken.user)
        setProfile(decodedToken.profil)
    }, [])

    const updateUser = async (formData) => {

        try {
            const res = await userService.updateUser(formData)
            localStorage.setItem('token', res.data.token)
            const token = localStorage.getItem('token')
            const decodedToken = jwtDecode(token)
            setUser(decodedToken.user)
            if (user?.role === "ENSEIGNANT") {
                navigate('/dashboard/enseignant')
            } else {
                navigate('/dashboard/eleve')
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <FirstLoginComponnent
            userName={profile?.nom || user?.login}
            onFormDataReady={updateUser}
            user={user}
        />
    )
}