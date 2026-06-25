import React from 'react'
import { MessageCircle, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

const EmptyChat = () => {

  const handleInvite = async () => {
    const inviteLink = "https://chatter-stack.vercel.app/register";
    const shareData = {
      title: "Join me on ChatterStack",
      text: "Hey! I am using ChatterStack to chat. Create an account and let's talk!",
      url: inviteLink,
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
  };

  return (
    <div className='flex-1 flex-col flex w-full h-screen items-center 
    justify-center text-center px-6'>
        <div className='bg-gray-100/70 p-9 rounded-2xl flex flex-col items-center gap-4'>

            {/* Animated Icon */}
            <MessageCircle 
              size={48} 
              className='text-gray-600 animate-bounce transition-colors duration-300'
            />

            {/* Title */}
            <h2 className='text-xl font-semibold text-gray-900 animate-fadeIn'>
              No messages yet
            </h2>

            {/* Description */}
            <p className='text-gray-700 animate-fadeIn delay-150'>
              Start a conversation by selecting a user from the left sidebar.
            </p>

            {/* Invite Button */}
            <button 
                onClick={handleInvite}
                className='mt-2 flex items-center gap-3 px-6 py-2.5 border-2 border-indigo-500 text-indigo-800 rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300 animate-fadeIn delay-100'
            >
                <UserPlus size={25} />
                <span className='font-medium'>Invite a Friend to Chat</span>
            </button>

        </div>
    </div>
  )
}

export default EmptyChat