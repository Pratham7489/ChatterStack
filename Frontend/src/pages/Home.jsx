import React,{ useEffect } from "react";
import Sidebar from "../components/Sidebar"
import useChatStore from "../store/useChatStore";
import EmptyChat from "../components/EmptyChat";
import Messages from "../components/Messages";
import Profile from "../components/Profile";

const Home = () => {
  const {selectedUser, setSelectedUser} = useChatStore()

  // MOBILE BACK BUTTON LOGIC
  useEffect(() => {
    // Jab koi user select ho (Chat khule), toh history mein ek entry daalo
    if (selectedUser) {
      window.history.pushState({ chatOpen: true }, "");
    }

    // Jab user mobile ka back button dabaye, toh ye function chalega
    const handlePopState = () => {
      if (selectedUser) {
        setSelectedUser(null); // Chat band karke list dikhao
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedUser, setSelectedUser]);
  
  const renderContent = () => {

     //  If no user selected, show EmptyChat
    if (!selectedUser) {
      return <EmptyChat />;
    }

    // If user selected "profile", show Profile
    if (selectedUser === "profile") {
      return <Profile />;
    }

    // Otherwise, show chat messages
    return <Messages />;
  };

  return (
    // 100dvh zaruri hai mobile safe area ke liye
    <div className="flex h-[100dvh] bg-gray-900 text-white overflow-hidden">
      
      {/* SIDEBAR: Mobile par tabhi dikhega jab koi user select NAHI hoga. Desktop par hamesha dikhega. */}
      <div className={`h-full w-full md:w-auto ${selectedUser ? "hidden md:block" : "block"}`}>
        <Sidebar />
      </div>

      {/* MAIN CONTENT: Mobile par tabhi dikhega jab user select HOGA. Desktop par hamesha dikhega. */}
      <main className={`flex-1 flex-col h-full overflow-hidden ${!selectedUser ? "hidden md:flex" : "flex w-full"}`}>
        {renderContent()}
      </main>
      
    </div>
  );
};

export default Home;
