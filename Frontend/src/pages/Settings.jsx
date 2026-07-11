import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

const Settings = () => {
  const navigate = useNavigate();
  const { deleteAccountAuth, isDeletingAccount } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
      const success = await deleteAccountAuth();
      if (success) {
          setShowDeleteModal(false);
          navigate("/register"); // Redirect to Register
      }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4 md:p-8 relative'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link
            to="/"
            className='p-2 hover:bg-gray-800 rounded-full transition-colors'
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className='text-2xl md:text-3xl font-bold'>Settings</h1>
        </div>

        {/* Settings Content */}
        <div className='bg-gray-800 rounded-xl p-6 md:p-8'>
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold mb-4'>Account Settings</h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-gray-700 rounded-lg'>
                  <div>
                    <p className='font-medium'>Notifications</p>
                    <p className='text-sm text-gray-400'>Manage your notification preferences</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input type='checkbox' className='sr-only peer' />
                    <div className='w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600'></div>
                  </label>
                </div>

                <div className='flex items-center justify-between p-4 bg-gray-700 rounded-lg'>
                  <div>
                    <p className='font-medium'>Dark Mode</p>
                    <p className='text-sm text-gray-400'>Toggle dark mode appearance</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input type='checkbox' className='sr-only peer' defaultChecked />
                    <div className='w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600'></div>
                  </label>
                </div>
              </div>
            </div>

            <div className='pt-6 border-t border-gray-700'>
              <h2 className='text-xl font-semibold mb-4'>Privacy & Security</h2>
              <div className='space-y-4'>
                <button className='w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'>
                  <p className='font-medium'>Change Password</p>
                  <p className='text-sm text-gray-400'>Update your account password</p>
                </button>
               
                <button className='w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'>
                  <p className='font-medium'>Blocked Users</p>
                  <p className='text-sm text-gray-400'>Manage blocked accounts</p>
                </button>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className='pt-6 border-t border-red-900/50 mt-8'>
              <h2 className='text-xl font-semibold text-red-500 mb-4'>Danger Zone</h2>
              <div className='p-4 bg-red-950/20 border border-red-900/50 rounded-lg'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                        <p className='font-medium text-red-400'>Delete Account</p>
                        <p className='text-sm text-gray-400'>Permanently remove your account and all associated data.</p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap'
                    >
                        Delete Account
                    </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
              <div className='bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-700 animate-fadeIn'>
                 
                  <div className='flex flex-col items-center text-center'>
                      <div className='w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4'>
                          <AlertTriangle size={32} className='text-red-500' />
                      </div>
                      <h2 className='text-2xl font-bold text-white mb-2'>Delete Account?</h2>
                      <p className='text-gray-400 mb-6'>
                          Are you sure you want to permanently delete your account? All your messages, profile details, and connections will be wiped out. <br /> <span className='font-semibold text-red-400'>This action cannot be undone.</span>
                      </p>
                  </div>

                  <div className='flex gap-3'>
                      <button
                          onClick={() => setShowDeleteModal(false)}
                          disabled={isDeletingAccount}
                          className='flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50'
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                          className='flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center'
                      >
                          {isDeletingAccount ? "Deleting..." : "Yes, Delete"}
                      </button>
                  </div>

              </div>
          </div>
      )}

    </div>
  )
}

export default Settings;
