import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import useAuthStore from "../store/useAuthStore.js";
import AppLogo from "../assets/AppLogo.png";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const { registerAuth, loginAuth, authUser } = useAuthStore();

  const switchView = (newView) => {
    setView(newView);
    setErrors({});
    setFormData({
        username: "",
        email: "",
        password: "",
    });
  }

  console.log("Auth User:", authUser);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (view === "login") {
        if (!formData.email) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
        
        if (!formData.password) newErrors.password = "Password is required";
    } else if (view === "register") {
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
    if (errors[name]) setErrors({...errors, [name]: "" });  
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (view === "register") {
        registerAuth({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });
    } else if (view === "login") {
        loginAuth({
            email: formData.email,
            password: formData.password,
        });
    } else {
        console.error("Unknown view:", view);   
    }
    setFormData({
        username: "",
        email: "",
        password: "",
    });
  };

  return (
    <div className="bg-black bg-opacity-95 text-white min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl
        backdrop-blur-xl bg-white/5 p-8 rounded-xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden">
            {/* Left side */}    
            <div className="hidden md:flex md:w-1/2 p-8 h-full items-center justify-center relative z-10">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-90">
                </div>
                <div className="relative z-20 flex flex-col items-center text-center p-4">
                    <div className="w-24">
                        <img src={AppLogo} alt="Logo" className="w-full h-auto"/>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Connect with Friends!</h1>
                    <p className="text-gray-200 text-lg font-light">Discover, share
                    and connect 💞 with people all over the world 🌍</p>
                </div>
            </div>
            {/* Right side */}
            <div className="w-full md:w-1/2 p-4 md:p-8 flex items-center
            justify-center">
                <AuthForm
                    view={view}
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    switchView={switchView}
                />
            </div>
        </div>
    </div>
  );
};

export default Login;
