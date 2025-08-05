import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAuth } from '../../context/AuthContext'

const Layout = () => {
    const { logout, user, userProfile } = useAuth()

    const navigate = useNavigate()

    const handleLogout = async () => {
        const result = await logout()
        if (result.success) {
            navigate('/')
        }
    }
    return (
    <>
        <div className=' flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
            <img src={assets.logo} alt="" className=' w-32 sm:w-40 cursor-pointer' onClick={()=> navigate('/')}/>
            <div className=' flex items-center gap-4'>
                <div className='text-right'>
                    <span className=' text-sm text-gray-600'>Welcome, {user?.email}</span>
                    <div className='text-xs text-primary font-medium'>Administrator</div>
                </div>
                <button className='text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-all' onClick={handleLogout}>Logout</button>
            </div>
        </div>
        <div className=' flex h-[calc(100vh-70px)]'>
            <Sidebar />
            <Outlet />
        </div>
    </>
)
}

export default Layout
