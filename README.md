# 🧠 AI Lab Management System (Client)

![Status](https://img.shields.io/badge/Status-Active_Development-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-green) ![License](https://img.shields.io/badge/License-Private-red)

A modern, responsive, and robust **Laboratory Management System** designed for the **Artificial Intelligence & Data Science Laboratory**. This client-side application serves as the central hub for lab members, captains, and administrators to manage projects, tasks, room occupancy, and team communications efficiently.

---

## 🚀 Tech Stack

We utilize a cutting-edge frontend stack to ensure performance, scalability, and a senior-grade architectural foundation.

### **Core Framework & Build Tool**
- **[React 19](https://react.dev/)**: Leveraging the latest library features for web user interfaces.
- **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling for lightning-fast HMR and optimized builds.

### **Styling & UI**
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[Lucide React](https://lucide.dev/)**: Beautiful, consistent, and lightweight icon set.

### **State Management & Architecture**
- **React Context API**: Centralized global state (Authentication, User Sessions, RBAC).
- **Custom Hooks**: Encapsulated business logic for cleaner, testable components.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions at the router level.

### **Networking & Integrations**
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client with global interceptors for automatic Firebase token injection and standardized error handling.
- **[Firebase](https://firebase.google.com/)**: 
    - **Authentication**: Secure JWT-based identity management.
    - **Storage**: Direct client-side uploads for reports and profile images.
- **[React Router Dom v7](https://reactrouter.com/)**: Client-side routing with nested, protected route guards.

### **DevOps & Containerization**
- **[Docker](https://www.docker.com/)**: Multi-stage production builds for minimal image size (~25MB).
- **[Nginx](https://www.nginx.com/)**: Optimized web server with SPA routing, static asset caching, and a `/health` endpoint for orchestration.

---

## 📂 Project Structure

The project follows a modular and scalable directory structure:

```bash
src/
├── 📂 assets/          # Static assets (images, SVGs)
├── 📂 components/      # Reusable UI components
│   ├── 📂 admin/       # Specialized administrative modules
│   ├── 📂 auth/        # Login/Register form abstractions
│   ├── 📂 profile/     # User profile update components
│   ├── ErrorBoundary.jsx # Global safety net for runtime errors
│   ├── ProtectedRoute.jsx # RBAC-enhanced route guard
│   └── ...
├── 📂 context/         # Global State Providers (AuthContent, etc.)
├── 📂 layouts/         # Page Layout Wrappers (Sidebar, Header)
├── 📂 pages/           # Application Views (Routes with Code Splitting)
├── 📂 services/        # API Layer (Axios configuration & Services)
├── 📂 utils/           # Helper functions (axiosInstance, imageUtils)
└── firebaseConfig.js   # Centralized Firebase initialization
```

---

## ✨ Key Features

### 🔐 **Advanced Security (RBAC)**
- **Role-Based Access Control**: Prevents unauthorized component mounting by checking permissions (`Admin`, `Captain`, `Member`) at the router level.
- **Automatic Token Synchronization**: Axios interceptors ensure every request is authenticated with a fresh Firebase ID token.
- **UX-Aware Guards**: Redirects users back to their intended destination after a successful login.

### ⚡ **High Performance & Stability**
- **Code Splitting**: Implemented via `React.lazy()` and `Suspense` to ensure users only download the code they need.
- **Optimized Auth Initialization**: A singleton promise pattern in the networking layer eliminates artificial delays during startup.
- **Global Error Boundary**: Catches and handles UI crashes gracefully, offering a professional fallback and reset mechanism.

### 👥 **Team & Report Management**
- **Direct Firebase Upload**: Reports are uploaded directly to Firebase Storage with strict PDF and 15MB file size enforcement.
- **Metadata Synchronization**: Automatic backend updates after successful storage operations.
- **Task Tracking**: Real-time status updates with visual feedback for project contributors.

### 📊 **Real-Time Monitoring**
- **Room Occupancy**: Live statistics on laboratory attendance.
- **Hardware Control**: Integrated UI for managing laboratory access and utilities (Electricity/Door status).

---

## 🐳 Docker Deployment

To build the production image with optimized Nginx serving:

```bash
docker build \
  --build-arg VITE_API_KEY="https://api.ailab.org.tr" \
  --build-arg VITE_FIREBASE_API_KEY="..." \
  -t ailab-panel:v1.0 .
```

*Developed for the KTUN AI & Data Science Laboratory.*
