# ChatterStack — Full-Stack Real-Time Chat Application

ChatterStack is a **real-time messaging application** built using the **MERN stack** with **Socket.IO**⚡for instant chat updates.  
It supports **instant chat**, **one-to-one conversations**, **media sharing**, **emoji support**, **edit/delete messages**, **profile customization** , **online status**, and delivering a **smooth modern UI** 🟣✨chat user experience.  
Perfect blend of **performance + real-time experience**.

---

## 🚀 Features

| 🔥 Feature | 💡 Description |
|----------|----------------|
| ⚡ Real-Time Messaging | Messages sync instantly using Socket.IO, no refresh needed. |
| 🔐 Secure Auth | JWT + HttpOnly Cookies keep session safe. |
| 🟢 Live Online Status | Know who is online right now! |
| 😄 Emoji Support | Express your emotions smoothly. |
| 🎥 Media Sharing | Send **images** & **videos** using Cloudinary. |
| ✏️ Edit / 🗑️ Delete Messages | Full message control for users. |
| 👤 Profile Editing | Upload profile picture & update bio easily. |
| 📱 Fully Responsive | Clean UI for **mobile**, **tablet**, and **desktop**. |

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React.js
- 🎨 Tailwind CSS
- 🧠 Zustand (State Management)
- ⚡ Vite
- 😍 Emoji Picker UI

### **Backend**
- 🔥 Node.js + Express.js
- 🧵 Socket.IO (Live Messaging)
- 🗄️ MongoDB + Mongoose
- ☁️ Cloudinary (Media Uploads)
- 🍪 JWT Authentication (Secure Cookies)

## 📂 Folder Structure

ChatterStack/
│
├── Backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── index.js
│
├── Frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ └── store/
│ │
│ │
│ └── vite.config.js
│
└── README.md

## 🖼️ UI Preview or Screenshots 👀

### 🔐 Login Page  
<img src="./screenshots/login.png" width="650"/>

### 💬 Real-Time Chat Window  
<img src="./screenshots/chat.png" width="650"/>

### 🎥 Image / Video Viewer  
<img src="./screenshots/media.png" width="650"/>

### 👤 Profile & Settings Page  
<img src="./screenshots/profile.png" width="650"/>

---

## ⚙️ Setup Instructions (Local Development)

1️⃣ Clone the Repo

- git clone: https://github.com/Pratham7489/ChatterStack-A-Full-Stack-Real-Time-Messaging-App.git

- cd  ChatterStack-A-Full-Stack-Real-Time-Messaging-App

2️⃣ Backend Setup

- cd Backend
- npm install

🎯 Create `.env` files in `backend/` and `frontend/`( Environment Variables )

***Backend `.env`***
  
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_secret_key
- CLOUDINARY_CLOUD_NAME=xxxx
- CLOUDINARY_API_KEY=xxxx
- CLOUDINARY_API_SECRET=xxxx
- CLIENT_URL=http://localhost:5173

***Frontend `.env`***

- VITE_SOCKET_URL=http://localhost:3232

🎯 Start Server:

- npm start

3️⃣ Frontend Setup

- cd Frontend
- npm install
- npm run dev

## 🚧 Future Improvements (Coming Soon)

- 💬 Group Chats
- 🔔 Push Notifications
- 📞 Voice & Video Calls (WebRTC)
- 🌈 Light Theme Mode

## 👨‍💻 Author : Pratham Patel 

Full Stack Developer — MERN + Real-Time Systems
- 💼 LinkedIn (optional)
- 🌍 Portfolio (optional)

## ⭐ Support & Appreciation

If you like this project, please 🌟 Star this repository — it motivates me!
