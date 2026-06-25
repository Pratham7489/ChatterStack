import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useChatStore from '../store/useChatStore'
import { UserPlus, Settings, User, LogOut } from 'lucide-react' 
import toast from 'react-hot-toast'

const SidebarProfileMenu = ({
    toggleProfileBox, 
    setToggleProfileBox, 
    logoutAuth, 
    collapsed 
}) => {
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const menuRef = useRef()
    const { setSelectedUser } = useChatStore() 
    
    useEffect(() => {
        if (toggleProfileBox) setVisible(true)
        else {
            const timer = setTimeout(() => setVisible(false), 200)
            return () => clearTimeout(timer)
        }    
    }, [toggleProfileBox])

    // Close on outside Click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setToggleProfileBox(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [setToggleProfileBox])

    useEffect(() => {
        if (collapsed) setToggleProfileBox(false)
    }, [collapsed, setToggleProfileBox])

    const handleLogout = async () => {
        await logoutAuth()
        setToggleProfileBox(false)
        navigate('/login')
    }

    // Handle Invite Logic
    const handleInvite = async () => {
        const inviteLink = "https://chatter-stack.vercel.app/register"; 
        const shareData = {
            title: 'Join me on ChatterStack',
            text: 'Hey! I am using ChatterStack to chat. Create an account and let\'s talk!',
            url: inviteLink
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log("Share cancelled or failed", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(inviteLink);
                toast.success("Invite link copied to clipboard!");
            } catch (error) {
                toast.error("Failed to copy link.");
            }
        }

        // Close the menu after they click the invite button
        setToggleProfileBox(false);
    };

    if (!visible) return null  

    return (
       <ul 
            ref={menuRef} 
            className={`absolute flex flex-col gap-5 bottom-14 left-0
            dropdown-content menu p-2 shadow rounded-xl w-56 bg-white text-gray-800
            transition-all duration-200 transform origin-bottom-left
            ${toggleProfileBox ? 'opacity-100 translate-y-0 scale-100' : "opacity-0 translate-y-2 scale-105 pointer-events-none"}`}
        >
            <li>
                <Link 
                    to="/settings" 
                    className='flex items-center justify-between hover:bg-gray-200 rounded px-2 py-1 w-full text-left text-gray-700'
                    onClick={() => setToggleProfileBox(false)} 
                >
                    <span>Settings</span>
                    <Settings size={16} className="text-gray-700" />
                </Link>
            </li>

            <li>
                <button 
                    className='flex items-center justify-between hover:bg-gray-200 rounded px-2 py-1 w-full text-left text-gray-700'
                    onClick={() => {
                        setToggleProfileBox(false);
                        navigate("/profile");
                    }} 
                >
                    <span>Profile</span>
                    <User size={16} className="text-gray-700" />
                </button>
            </li>

            <li>
                <button 
                    className='flex items-center justify-between hover:bg-gray-200 rounded px-2 py-1 w-full text-left text-gray-700'
                    onClick={handleInvite} 
                >
                    <span>Invite a Friend</span>
                    <UserPlus size={16} className="text-gray-700" />
                </button>
            </li>

            <li>
                <button 
                    className='flex items-center justify-between hover:bg-gray-200 rounded px-2 py-1 w-full text-left text-red-500 font-medium'
                    onClick={() => {
                        handleLogout()
                        setToggleProfileBox(false)
                    }} 
                >
                    <span>Logout</span>
                    <LogOut size={16} className="text-red-500" />
                </button>
            </li>

       </ul>
    )
}

export default SidebarProfileMenu;