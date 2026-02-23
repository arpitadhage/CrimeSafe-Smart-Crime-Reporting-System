# 🚨 CrimeSafe  
## Smart Crime Reporting & Public Safety Web Application

CrimeSafe is a full-stack web application designed to empower citizens to report crimes easily and quickly, while providing law enforcement and administrators with actionable insights and organized crime data.

Built to improve community safety, enhance incident visibility, and streamline reporting workflows.

---

## 🚀 Key Features

📍 **User Crime Reporting**  
Report incidents with descriptions, locations, photos, and timestamps.

📸 **Image & Evidence Upload**  
Attach images related to incidents for better documentation.

🗺 **Location Tagging**  
Precise GPS location tagging for accurate crime mapping.

👮 **Admin Dashboard**  
View, filter, and manage crime reports in a structured dashboard.

📊 **Data Visualization**  
Charts and summaries for crime trends, areas, and categories.

🔐 **Authentication & Security**  
Protected login system for users and admins.

---

## 🏗 System Architecture

User Report Submission  
⬇  
Backend API (Node / Python)  
⬇  
Database (MongoDB / SQL)  
⬇  
Admin Dashboard  
⬇  
Visualization & Analytics

---

## 🛠 Tech Stack

### 🖥 Frontend
- React.js / HTML / CSS / Tailwind
- React Router
- Axios

### ⚙️ Backend
- Node.js
- Express.js
- RESTful API

### 🗄 Database
- MongoDB Atlas (or local MongoDB)

### 🛡 Authentication
- JWT (JSON Web Tokens)
- Bcrypt Password Encryption

---

## 📁 Project Structure


CrimeSafe-Smart-Crime-Reporting-System/
├── backend/
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.js
│ └── package.json
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/arpitadhage/CrimeSafe-Smart-Crime-Reporting-System.git
cd CrimeSafe-Smart-Crime-Reporting-System
2️⃣ Backend Setup
cd backend
npm install

Create .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Run backend:

npm run dev

Backend runs at:

http://localhost:5000
3️⃣ Frontend Setup

Open new terminal:

cd frontend
npm install
npm start

Frontend runs at:

http://localhost:3000
🔐 Environment Variables
Variable	Description
MONGO_URI	MongoDB connection string
JWT_SECRET	JWT secret for authentication
PORT	Backend server port
```
---
📌 Roadmap

 Add real-time notifications

 Mobile app version (React Native / Flutter)

 Role-based access & permissions

 Map integration (Google Maps / Leaflet)

 Crime clustering & heatmaps
---
🎯 Use Cases

Community Crime Reporting

Local Government Safety Portals

Neighborhood Watch Tools

Police Station Reporting System

Urban Analytics & Safety Research
---
🧠 Innovation Highlights

Encourages community involvement

Improves transparency in crime reporting

Centralized dashboard for admin management

Insightful crime trend analysis
---
📜 License

MIT License

👩‍💻 Developed By

Arpita Dhage

B.Tech Computer Science (AI/ML)
