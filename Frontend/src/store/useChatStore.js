import { create } from "zustand"
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

const useChatStore = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        set({ isUserLoading: true });
        try {
            const { data } = await axiosInstance.get("/message/users");
            if (data?.success) {
                set({ users: data?.users });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Users failed");
        }finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async(userId) => {
        set({ isMessagesLoading: true });
        try {
            const { data } = await axiosInstance.get(`/message/${userId}`);
            if (data?.success) {
                set({ messages: data?.messages });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Messages failed");
        }finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData) => {
        const { selectedUser, messages } = get();
        if(!selectedUser) return;
        
        try {
            const { data } = await axiosInstance.post(
                `/message/send/${selectedUser?._id}`,
                messageData
            );

            if (data?.success) {
               const editId = messageData.get && messageData.get("editMessageId");
               if (editId) {

                    // Do NOT append new message — update in place
                    set((state) => ({
                        messages: state.messages.map((m) =>
                            m._id === data.data._id ? data.data : m
                        ),
                    }));
                } 
                else {
                    // Normal new message
                    set({ messages: [...messages, data.data] });
                }
            }
        } catch (error) {
            console.log("Error send message", error);
            console.error("Full error:", error.response || error);
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    editMessage: async (id, newText) => {
        try {
          const { data } = await axiosInstance.patch(`/message/${id}`, { text: newText });
          if (data?.success) {
            set(state => ({
              messages: state.messages.map(m => m._id === id ? data.data : m)
            }));
          }
        } catch (e) {
          toast.error(e?.response?.data?.message || "Edit failed");
        }
    },

    // deleteMessages: async (ids) => {
    //     try {
    //       const { data } = await axiosInstance.delete(`/message/bulk`, { data: { messageIds: ids } });
    //       set(state => ({
    //         messages: state.messages.filter(m => !data.deletedIds.includes(m._id))
    //       }));
    //     } catch (e) {
    //       toast.error(e?.response?.data?.message || "Delete failed");
    //     }
    // },


    // deleteMessages: async (messageIds) => {
    //     try {
    //       await axiosInstance.delete('/message/delete', { data: { messageIds } });

    //       // Update messages state to remove deleted ones
    //       set(state => ({
    //         messages: state.messages.filter(m => !messageIds.includes(m._id))
    //       }));

    //       toast.success("Message deleted");
    //     } catch (error) {
    //       console.error('Delete failed:', error);
    //       toast.error("Failed to delete messages");
    //     }
    // },

    deleteMessages: async (messageIds) => {
        try {
            const { data } = await axiosInstance.delete(`/message/bulk`, { 
                data: { messageIds } 
            });
            set(state => ({
                messages: state.messages.filter(m => !data.deletedIds.includes(m._id))
            }));
            toast.success("Messages deleted");
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error(error?.response?.data?.message || "Failed to delete messages");
        }
    },

    subscribeMessages: () => {
        const socket = useAuthStore.getState().socket;
        
        if (!socket) {
            console.log("Socket not available for subscription");
            return;
        }

        // ---- NEW MESSAGE  LISTENER ----
        socket.off("newMessage"); // clear previous listener

        socket.on("newMessage", (newMessage) => {
            const { messages, selectedUser } = get();
            const currentUserId = useAuthStore.getState().authUser?._id?.toString();

            if (!selectedUser) return;

            // Convert to strings for comparison
            const senderId = newMessage.senderId?.toString();
            const receiverId = newMessage.receiverId?.toString();
            const selectedId = selectedUser._id?.toString();
            

            console.log("Sender:", senderId, "Receiver:", receiverId, "Selected:", selectedId);

            // Only add message if it's part of the current conversation
            if (
                (senderId === selectedId && receiverId === currentUserId) ||
                (senderId === currentUserId && receiverId === selectedId)
            ) {
                console.log("Message belongs to current chat, adding...");
                set({ messages: [...messages, newMessage] });
            } else {
                console.log("Message not for current chat, ignoring");
            }
        });

        // ---- MESSAGE DELETE LISTENER ----
        socket.off("messagesDeleted");

        socket.on("messagesDeleted", (deletedIds) => {
            set(state => ({
                messages: state.messages.filter(m => !deletedIds.includes(m._id))
            }));
        });

        // ---- MESSAGE EDIT LISTENER  ----
        socket.off("messageUpdated");

        socket.on("messageUpdated", (updatedMessage) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg._id === updatedMessage._id ? updatedMessage : msg
            ),
          }));
        });

    },

    unSubscribeMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
            socket.off("messagesDeleted");
            socket.off("messageUpdated");
            console.log("Unsubscribed from all message events");
        }
    },

    setSelectedUser: (selectedUser) => {
        if (selectedUser) {
          localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
        } else {
          localStorage.removeItem("selectedUser");
        }
        set({ selectedUser });
    },

}));

export default useChatStore;