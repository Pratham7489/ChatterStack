import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../store/useChatStore";
import ProfileImage from "./ProfileImage";
import useAuthStore from "../store/useAuthStore";
import EditBar from "./EditBar";
import ChatInput from "./ChatInput";
import BaseModal from "./BaseModal";
import { Trash, Pencil, ArrowLeft } from "lucide-react";

// Detect if message contains ONLY emojis (no normal text)
const isOnlyEmojis = (text) => {
  if (!text) return false;
  const emojiRegex = /^[\p{Emoji}\s]+$/u; // Unicode-based emoji detection
  return emojiRegex.test(text.trim());
};

const Messages = () => {
  const {
    selectedUser,
    getMessages,
    messages,
    sendMessage,
    deleteMessages,
    subscribeMessages,
    unSubscribeMessages,
    setSelectedUser,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [chatMedia, setChatMedia] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    if (!selectedUser) return;

    // Load past messages
    getMessages(selectedUser._id);

    // Start listening live
    subscribeMessages();

    // Stop listening when switching chat
    return () => unSubscribeMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    const mediaArr = messages
      .filter((m) => m.mediaUrl)
      .map((m) => ({
        mediaUrl: m.mediaUrl,
        mediaType: m.mediaType,
      }));
    setChatMedia(mediaArr);
  }, [messages]);

  // Message Selection Handlers
  const handleLongPressStart = (messageId) => {
    const timer = setTimeout(() => {
      setSelectionMode(true);
      setSelectedMessages(new Set([messageId]));
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const toggleMessageSelection = (messageId) => {
    if (!selectionMode) return;

    setSelectedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    const ids = [...selectedMessages];
    await deleteMessages(ids); // <-- correctly calls store delete API
    setSelectedMessages(new Set());
    setSelectionMode(false);
  };

  const handleEditMessage = () => {
    if (selectedMessages.size !== 1) return;
    const id = [...selectedMessages][0];
    const m = messages.find((x) => x._id === id);

    if (m && !m.mediaUrl) {
      // Only allow edit if it's text-only
      setEditingMessage(m); // <-- this will open edit mode UI
      setSelectionMode(false);
      setSelectedMessages(new Set());
    }
  };

  const handleClearSelection = () => {
    setSelectedMessages(new Set());
    setSelectionMode(false);
  };

  const openMediaModel = (msg) => {
    const index = chatMedia.findIndex((m) => m.mediaUrl === msg.mediaUrl);
    setMediaIndex(index >= 0 ? index : 0);
    setSelectedMedia(msg);
    setIsModalOpen(true);
    setIsPlaying(msg.mediaType === "video");
    setIsMuted(true);
  };

  const closeMediaModel = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    setIsPlaying(false);
    setIsMuted(true);
  };

  const showPrev = mediaIndex > 0;
  const showNext = mediaIndex < chatMedia.length - 1;

  const handlePrev = () => {
    if (showPrev) {
      const prevIndex = mediaIndex - 1;
      setMediaIndex(prevIndex);
      setSelectedMedia(chatMedia[prevIndex]); // FIXED: was 'selectedMedia()'
      setIsPlaying(chatMedia[prevIndex].mediaType === "video");
      setIsMuted(true);
    }
  };

  const handleNext = () => {
    if (showNext) {
      const nextIndex = mediaIndex + 1;
      setMediaIndex(nextIndex);
      setSelectedMedia(chatMedia[nextIndex]); // FIXED: was 'selectedMedia()'
      setIsPlaying(chatMedia[nextIndex].mediaType === "video");
      setIsMuted(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 w-full overflow-hidden relative">
      {/* Header */}
      {/* Header */}
      {selectedUser && (
        <div className="flex-shrink-0 flex items-center justify-between p-3 md:p-4 border-b border-gray-700 bg-gray-800 z-10">
          
          {/* LEFT SIDE: Back Button (Sirf Mobile par dikhega) */}
          <div className="flex items-center">
             <button 
                onClick={() => setSelectedUser(null)}
                className="md:hidden p-2 -ml-2 mr-2 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
             >
                <ArrowLeft size={24} />
             </button>
          </div>

          {/* RIGHT SIDE: Name, Status & Profile Image */}
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end"> {/* items-end se text right align hoga */}
                <span className="font-semibold text-white text-sm sm:text-base">
                  {selectedUser?.username}
                </span>
                <span className="text-xs text-green-400">
                  {onlineUsers?.includes(selectedUser?._id) ? "online" : "offline"}
                </span>
             </div>
             <ProfileImage
                user={selectedUser}
                className="w-10 h-10 md:w-12 md:h-12"
                authUser={authUser}
                onlineUsers={onlineUsers}
             />
          </div>

        </div>
      )}

      {/* Selection Action Bar */}
      {selectionMode && (
        <div className="flex-shrink-0 flex items-center justify-between bg-gray-500 text-white z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClearSelection}
              className="hover:bg-gray-400 px-3 py-1.5 rounded-full"
            >
              ✕
            </button>
            <span className="font-semibold">
              {selectedMessages.size} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* NAYA LOGIC: Pencil tabhi dikhega jab msg text ho AUR sender current user ho */}
            {selectedMessages.size === 1 &&
              (() => {
                const id = [...selectedMessages][0];
                const m = messages.find((x) => x._id === id);
                return m && !m.mediaUrl && m.senderId === authUser?._id; // <-- YAHAN SENDER CHECK ADD KIYA
              })() && (
                <Pencil
                  onClick={handleEditMessage}
                  className="text-white mx-4 cursor-pointer hover:text-indigo-300"
                />
              )}

            <Trash
              onClick={handleDeleteSelected}
              className="text-white cursor-pointer hover:text-red-300"
            />
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overscroll-none p-3 md:p-5 space-y-3 no-scrollbar">
        {messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xs sm:text-sm md:text-base">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages?.map((msg, idx) => {
            const isSender = msg?.senderId === authUser?._id;

            return (
              <div
                key={idx}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  onMouseDown={() => handleLongPressStart(msg._id)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(msg._id)}
                  onTouchEnd={handleLongPressEnd}
                  onClick={(e) => {
                    if (selectionMode) {
                      // toggle selection in selection mode
                      toggleMessageSelection(msg._id);
                    } else if (msg.mediaUrl) {
                      openMediaModel(msg);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectionMode(true);
                    setSelectedMessages(new Set([msg._id]));
                  }}
                  className={`
                                        relative max-w-[80%] sm:max-w-[50%] w-auto px-1 py-1 rounded-2xl
                                        ${isSender ? "bg-indigo-800 text-white" : "bg-gray-700 text-white"}
                                        ${msg.mediaUrl ? "cursor-pointer hover:opacity-90" : ""}
                                        ${selectedMessages.has(msg._id) ? "ring-2 ring-indigo-400" : ""}
                                        transition-all duration-20 space-y-2`}
                >
                  {/* Check icon bubble when in selection mode */}
                  {selectionMode && (
                    <span
                      className={`
                                            absolute -left-6 top-1.5 w-4 h-4 rounded-full border
                                            ${
                                              selectedMessages.has(msg._id)
                                                ? "bg-indigo-500 border-indigo-500"
                                                : "border-gray-400"
                                            }
                                            `}
                    />
                  )}

                  {/* TEXT */}
                  {msg?.text && (
                    <div className="flex items-center gap-1">
                      <p
                        className={`break-words leading-relaxed 
                                           ${
                                             /^[\p{Emoji}\s]+$/u.test(
                                               msg?.text?.trim() || "",
                                             )
                                               ? "text-3xl md:text-4xl"
                                               : "text-lg"
                                           }`}
                      >
                        {msg?.text}
                      </p>

                      {/* ✅ Show edited label */}
                      {msg.editedAt && !msg.mediaUrl && (
                        <span className="text-[10px] opacity-60">(edited)</span>
                      )}
                    </div>
                  )}

                  {/* IMAGE */}
                  {msg?.mediaUrl && msg?.mediaType === "image" && (
                    <img
                      src={msg?.mediaUrl}
                      alt="media"
                      className="w-full max-h-[260px] rounded-xl object-cover"
                    />
                  )}

                  {/* VIDEO */}
                  {msg?.mediaUrl && msg?.mediaType === "video" && (
                    <video
                      src={msg?.mediaUrl}
                      className="w-full max-h-[260px] rounded-xl"
                      controls
                      muted
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Agar edit mode me hai toh sirf EditBar dikhao, warna ChatInput dikhao */}
      <div className="flex-shrink-0 pb-env-safe">
        {editingMessage ? (
          <EditBar
            key={editingMessage._id}
            message={editingMessage}
            onCancel={() => setEditingMessage(null)}
          />
        ) : (
          <ChatInput />
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <BaseModal
          isOpen={isModalOpen}
          onClose={closeMediaModel}
          showPrev={showPrev}
          showNext={showNext}
          onPrev={handlePrev}
          onNext={handleNext}
        >
          <div className="flex items-center justify-center w-full h-full p-4">
            {selectedMedia?.mediaType === "image" && (
              <img
                src={selectedMedia.mediaUrl}
                alt="selectedMedia"
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {selectedMedia?.mediaType === "video" && (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={selectedMedia.mediaUrl}
                  className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
                  controls
                  autoPlay
                  muted={isMuted}
                />
              </div>
            )}
          </div>
        </BaseModal>
      )}
    </div>
  );
};

export default Messages;
