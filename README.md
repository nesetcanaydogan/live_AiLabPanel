# 🧠 AI Lab Management System (Client)

![Status](https://img.shields.io/badge/Status-Public_Release-green) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

**🚀 Live Production:** [ailab.org.tr](https://ailab.org.tr)

A modern, responsive, and robust **Laboratory Management System** designed for the **KTUN AI & Data Science Laboratory**. This client-side application serves as the central hub for lab members, captains, and administrators to manage projects, tasks, room occupancy, and team communications efficiently.

> **Note:** This repository is a sanitized public export. Sensitive configurations and internal documentation have been removed for security compliance.

---

## 🚀 Tech Stack

- **[React 19](https://react.dev/)** & **[Vite](https://vitejs.dev/)**: Core framework and next-gen build tooling.
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first styling.
- **[Firebase](https://firebase.google.com/)**: Secure Auth & Storage integrations.
- **[Axios](https://axios-http.com/)**: Standardized API client with interceptors for JWT injection.
- **[Docker](https://www.docker.com/)** & **[Nginx](https://www.nginx.com/)**: Production-ready containerization and optimized serving.

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Firebase Project (for Auth & Storage)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ktun-ailab/client.git
   cd client
   ```

2. **Setup Environment Variables:**
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   *Required variables include Firebase Config and the Backend API URL.*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```bash
src/
├── 📂 components/      # Reusable UI components & RBAC Guards
├── 📂 context/         # Global State (Auth, RBAC)
├── 📂 layouts/         # Page Layout Wrappers
├── 📂 pages/           # Application Views (Lazy Loaded)
├── 📂 services/        # API Layer & Services
└── 📂 utils/           # Shared Utilities (Axios, Image Processing)
```

---

## 🔐 Security & Compliance

- **Sanitized Export:** All internal API keys, private IPs, and sensitive developer logs have been stripped.
- **RBAC:** Fine-grained Role-Based Access Control implemented at the router and component levels.
- **Auto-Auth:** Axios interceptors handle Firebase ID Token refreshing and injection automatically.
- **Secure Handling:** No sensitive data is stored in local storage; strictly relying on Firebase Auth state.

---

## 🐳 Docker Deployment

To build and run the production-optimized image:

```bash
docker build \
  --build-arg VITE_API_BASE_URL="https://api.yourdomain.com" \
  --build-arg VITE_FIREBASE_API_KEY="..." \
  -t ailab-panel:latest .

docker run -p 80:80 ailab-panel:latest
```

---

## 📄 License & Contributing

- **License:** Distributed under the **MIT License**. See `LICENSE` for more information.
- **Contributing:** Contributions are welcome! Please read `CONTRIBUTING.md` for our code of conduct and submission process.

*Developed by the KTUN AI & Data Science Laboratory Team.*
