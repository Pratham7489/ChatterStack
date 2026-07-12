import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import ProfileImage from "./ProfileImage";
import AppLogo from "../assets/AppLogo.png";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import SidebarProfileMenu from "./SidebarProfileMenu";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggleProfileBox, setToggleProfileBox] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const { authUser, logoutAuth, onlineUsers } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser } = useChatStore();

  // Asli online count nikalne ke liye apne aapko (authUser) list se bahar nikal do
  const exactOnlineUsers =
    onlineUsers?.filter((id) => id !== authUser?._id) || [];

  // Ab jo length bachi, wo 100% correct "other online users" ki hai
  const onlineCount = exactOnlineUsers.length;

  // Jab "Online only" checkbox tick ho, toh sirf exactOnlineUsers ko dikhao
  const filteredUsers = showOnlineUsers
    ? users?.filter((user) => exactOnlineUsers.includes(user?._id))
    : users;

  // load all users
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // close mobile sidebar on selecting a user
  useEffect(() => {
    if (selectedUser && isMobileView) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedUser, isMobileView]);

  return (
    <>
      {/* Sidebar main container */}
      <aside
        className={`h-full p-4 flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out z-50 border-r border-white/10 ${collapsed && !isMobileView ? "w-20" : "w-full md:w-64"}`}
      >
        {/* Sidebar content wrapper */}
        <div className="flex flex-col justify-between h-full overflow-hidden">
          {/* Top Section (Logo + Users List) */}
          <div>
            {/* Logo */}
            <div className="flex justify-center">
              <Link
                to="/"
                className={`flex justify-center transition-all duration-500 rounded-xl bg-gradient-to-r from-purple-500 to-purple-300 ${
                  collapsed && !isMobileView ? "p-1 w-full" : "p-2 w-full"
                }`}
              >
                <img
                  src={AppLogo}
                  alt="logo"
                  className={`transition-transform duration-500 ease-in-out ${
                    collapsed && !isMobileView ? "h-10 w-10" : "h-16 w-auto"
                  }`}
                />
              </Link>
            </div>

            {/* Show online users toggle */}
            {(!collapsed || isMobileView) && (
              <div className="mt-3 flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlineUsers}
                    onChange={(e) => setShowOnlineUsers(e.target.checked)}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-sm text-gray-300">Online only</span>
                </label>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                  {onlineCount}
                </span>
              </div>
            )}

            {/* Users List */}
            <div className="flex-1 overflow-y-auto no-scrollbar mt-4">
              <nav className="flex flex-col gap-2">
                {filteredUsers?.length === 0 ? (
                  <div className="text-center text-zinc-500 text-sm py-8">
                    {showOnlineUsers ? "No online users" : "No users found"}
                  </div>
                ) : (
                  filteredUsers?.map((user, i) => {
                    const isActive = selectedUser?._id === user?._id;
                    return (
                      <button
                        key={user?._id}
                        onClick={() => setSelectedUser(user)}
                        className={`flex items-center rounded-xl transition-all duration-300 ${
                          collapsed && !isMobileView
                            ? "justify-center p-2"
                            : "gap-3 p-2"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold"
                            : "hover:bg-gray-700 text-white"
                        }`}
                        style={{ transitionDelay: `${i * 30}ms` }}
                      >
                        <ProfileImage
                          user={user}
                          authUser={authUser}
                          onlineUsers={onlineUsers}
                          collapsed={collapsed && !isMobileView}
                          className={
                            collapsed && !isMobileView ? "w-8 h-8" : "w-10 h-10"
                          }
                          online
                        />
                        {(!collapsed || isMobileView) && (
                          <span className="text-sm font-medium truncate">
                            {user?.username}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </nav>
            </div>
          </div>

          {/* Bottom Section (Profile) */}
          <div className="sticky bottom-0 bg-gray-900 pt-3 border-t border-white/10">
            <button
              onClick={() => setToggleProfileBox(!toggleProfileBox)}
              className={`flex items-center w-full justify-center ${
                collapsed && !isMobileView ? "p-2" : "gap-3 p-2"
              } rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-800`}
            >
              <ProfileImage
                user={authUser}
                authUser={authUser}
                onlineUsers={onlineUsers}
                collapsed={collapsed && !isMobileView}
                className={collapsed && !isMobileView ? "w-8 h-8" : "w-10 h-10"}
              />
              {(!collapsed || isMobileView) && (
                <div className="flex flex-col flex-1 items-center text-center">
                  <span className="font-semibold text-sm truncate text-center">
                    {authUser?.username}
                  </span>
                  <span className="text-xs text-gray-400">View Profile</span>
                </div>
              )}
            </button>
          </div>

          {/* Profile Menu Dropdown */}
          <div
            className={`
              absolute bottom-6 left-4 z-50 
              ${collapsed && !isMobileView ? "translate-x-20" : "translate-x-0"} 
              transition-transform duration-300
            `}
          >
            <div className="bg-gray-800 shadow-xl rounded-lg">
              <SidebarProfileMenu
                toggleProfileBox={toggleProfileBox}
                setToggleProfileBox={setToggleProfileBox}
                logoutAuth={logoutAuth}
                collapsed={collapsed && !isMobileView}
              />
            </div>
          </div>
        </div>

        {/* Collapse Arrow — Desktop Only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:block absolute top-4 -right-4 bg-gray-700/50 hover:bg-gray-700 
          text-white p-1 rounded-full transition-colors"
        >
          {collapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
