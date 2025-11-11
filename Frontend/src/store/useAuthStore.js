import toast from 'react-hot-toast';
import { create } from 'zustand'
import axiosInstance from '../lib/axios.js';
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3232";

const useAuthStore = create((set, get) => ({
    authUser: null,
    isAuthenticated: false,
    loading: true,
    isSigningUp: false,
    isLoginingUp: false,
    isUpdateProfile: false,
    socket:null,
    onlineUsers: [],
    
    profileAuth: async () => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.get("/user/profile");
            set({ authUser: data?.user, isAuthenticated: true });
            get().connectSocket();
        } catch (error) {
            console.log("Error in getting profile:", error);
        } finally {
            set({ loading: false });
        }
    },
    registerAuth: async (userData) => {
        set({ isSigningUp: true });
        try {
            const { data } = await axiosInstance.post("/user/register", userData);
            set({ authUser: data?.user, isAuthenticated: true });
            get().connectSocket();
            toast.success(data?.message || "Registered Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in registration");
        } finally {
            set({ isSigningUp: false });
        }
    },
    loginAuth: async (userData) => {
        set({ isLoginingUp: true });
        try {
            const { data } = await axiosInstance.post("/user/login", userData);
            set({ authUser: data?.user, isAuthenticated: true });
            get().connectSocket();
            toast.success(data?.message || "Logged in Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in login");
        } finally {
            set({ isLoginingUp: false });
        }
    },
    logoutAuth: async () => {
        try {
            get().disconnectSocket();
            await axiosInstance.get("/user/logout");
            set({ authUser: null, isAuthenticated: false, socket: null  });
            toast.success("Logged out Successfully"); // FIXED: Removed data reference
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in logout");
        }
    },
    updateProfileImage: async (userData) => {
        set({ isUpdateProfile: true });
        try {
            const { data } = await axiosInstance.post("/user/update", userData);
            set({ authUser: data?.user, isAuthenticated: true });
            toast.success(data?.message || "Profile updated Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in updating profile");
        } finally {
            set({ isUpdateProfile: false });
        }
    },
    updateProfileData: async (userData) => {
        set({ isUpdateProfile: true });
        try {
            const { data } = await axiosInstance.put("/user/update", userData);
            set({ authUser: data?.user, isAuthenticated: true });
            toast.success(data?.message || "Profile updated Successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error in updating profile");
        } finally {
            set({ isUpdateProfile: false });
        }
    },

    connectSocket : () => {
        const { authUser, socket } = get();

        // Don't connect if no user or already connected
        if (!authUser || socket?.connected){
            console.log('Socket connection skipped:', { 
                hasUser: !!authUser, 
                isConnected: socket?.connected 
            });
            return;
        }

        console.log('Connecting socket for user:', authUser._id);


        // Create socket connection with userId in query
        const  newSocket = io(BASE_URL, {
            query: {
                userId: authUser?._id
            },
            transports: ["websocket"],
        });
        
        // Listen for connection
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        // Listen for disconnect
        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Listen for online users updates 
        newSocket.on('getOnlineUsers', (users) => {
            set({ onlineUsers: users });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            console.log('Disconnecting socket...');
            socket.disconnect();
            set({ socket: null });
        }
    },
}));

export default useAuthStore;