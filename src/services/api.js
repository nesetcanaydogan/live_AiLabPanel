import axiosInstance from "../utils/axiosInstance";

// Use the robust instance
const apiClient = axiosInstance;

// API Requests

// --- Authentication ---
export const registerUser = (userData) => {
  return apiClient.post("/api/Auth/register", userData);
};

export const loginUser = (loginData) => {
  return apiClient.post("/api/Auth/login", loginData);
};

export const loginFirebase = (firebaseData) => {
  return apiClient.post("/api/Auth/login-firebase", firebaseData);
};

export const refreshToken = (tokenData) => {
  return apiClient.post("/api/Auth/refresh-token", tokenData);
};

export const logoutUser = (tokenData) => {
  return apiClient.post("/api/Auth/logout", tokenData);
};

export const getMe = () => {
  return apiClient.get("/api/Auth/me");
};

export const adminCreateFirebaseUser = (userData) => {
  return apiClient.post("/api/Auth/admin/create-firebase-user", userData);
};

export const getMigrationStatus = () => {
  return apiClient.get("/api/Auth/admin/migration-status");
};

// --- Users ---
export const getAllUsers = (params) => {
  return apiClient.get("/api/Users", { params });
};

export const getUserDetailById = (id) => {
  return apiClient.get(`/api/Users/${id}`);
};

export const updateUserPhone = (id, phone) => {
  return apiClient.put(`/api/Users/${id}`, { phone });
};

export const deleteUser = (id) => {
  return apiClient.delete(`/api/Users/${id}`);
};

export const updateUserStatus = (id, status) => {
  return apiClient.put(`/api/Users/${id}/status`, { status });
};

export const updateUserImage = (id, imageUrl) => {
  return apiClient.put(`/api/Users/${id}/image`, { profileImageUrl: imageUrl });
};

// --- Profile ---
export const getUserById = () => {
  return apiClient.get(`/api/Profile`);
};

export const updateProfile = (profileData) => {
  return apiClient.put("/api/Profile", profileData);
};

export const updateProfileImage = (imageUrl) => {
  return apiClient.put("/api/Profile/image", { profileImageUrl: imageUrl });
};

export const updatePhone = (phone) => {
  return apiClient.put("/api/Profile/update-phone", { phone });
};

export const updateEmail = (newEmail) => {
  return apiClient.put("/api/Profile/update-email", { newEmail });
};

export const getDefaultAvatars = () => {
  return apiClient.get("/api/Profile/avatars/defaults");
};

export const getLeaderboard = () => {
  return apiClient.get("/api/Profile/leaderboard");
};

// --- Projects ---
export const getAllProjects = (params) => {
  return apiClient.get("/api/Projects", { params });
};

export const getMyProjects = (params) => {
  return apiClient.get(`/api/Projects/my-projects`, { params });
};

export const getProjectById = (id) => {
  return apiClient.get(`/api/Projects/${id}`);
};

export const createProject = (projectData) => {
  return apiClient.post("/api/Projects", projectData);
};

export const updateProject = (id, projectData) => {
  return apiClient.put(`/api/Projects/${id}`, projectData);
};

export const deleteProject = (id) => {
  return apiClient.delete(`/api/Projects/${id}`);
};

export const getUserProjects = (userId) => {
  return apiClient.get(`/api/Projects/user/${userId}`);
};

export const transferProjectOwnership = (projectId, transferData) => {
  return apiClient.post(`/api/Projects/${projectId}/transfer-ownership`, transferData);
};

export const getProjectMembers = (projectId) => {
  return apiClient.get(`/api/Projects/${projectId}/members`);
};

export const addProjectMember = (projectId, memberData) => {
  return apiClient.post(`/api/Projects/${projectId}/members`, memberData);
};

export const removeProjectMember = (projectId, userId) => {
  return apiClient.delete(`/api/Projects/${projectId}/members/${userId}`);
};

export const updateProjectMemberRole = (projectId, userId, roleData) => {
  return apiClient.put(`/api/Projects/${projectId}/members/${userId}/role`, roleData);
};

// --- Tasks ---
// NOTE: Tasks remains lowercase per previous verified fix
export const getMyTasks = (params) => {
  return apiClient.get("/api/tasks/my-tasks", { params });
};

export const getProjectTasks = (projectId, params) => {
  return apiClient.get(`/api/tasks/project/${projectId}`, { params });
};

export const getTaskById = (id) => {
  return apiClient.get(`/api/tasks/${id}`);
};

export const createTask = (taskData) => {
  return apiClient.post("/api/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return apiClient.put(`/api/tasks/${id}`, taskData);
};

export const deleteTask = (id) => {
  return apiClient.delete(`/api/tasks/${id}`);
};

export const getUserTaskHistory = (userId) => {
  return apiClient.get(`/api/tasks/user/${userId}/history`);
};

export const updateTaskStatus = (id, status) => {
  return apiClient.put(`/api/tasks/${id}/status`, { status });
};

// --- Admin Score ---
export const getAdminPendingTasks = () => {
  return apiClient.get("/api/AdminScore/pending-tasks");
};

export const assignTaskScore = (taskId, multiplier) => {
  return apiClient.post(`/api/AdminScore/tasks/${taskId}/assign-score`, multiplier, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const adjustUserScore = (userId, scoreData) => {
  return apiClient.post(`/api/AdminScore/users/${userId}/adjust-score`, scoreData);
};

// --- Bug Reports ---
export const reportBug = (reportData) => {
  return apiClient.post("/api/BugReports", reportData);
};

// --- Roles ---
export const getRoles = () => {
  return apiClient.get("/api/Roles");
};

export const createRole = (roleData) => {
  return apiClient.post("/api/Roles", roleData);
};

export const getRoleById = (id) => {
  return apiClient.get(`/api/Roles/${id}`);
};

export const updateRole = (id, roleData) => {
  return apiClient.put(`/api/Roles/${id}`, roleData);
};

export const deleteRole = (id) => {
  return apiClient.delete(`/api/Roles/${id}`);
};

export const getRoleByName = (roleName) => {
  return apiClient.get(`/api/Roles/name/${roleName}`);
};

export const assignRole = (userId, roleName) => {
  return apiClient.post("/api/Roles/assign", { userId, roleName });
};

export const removeRole = (userId, roleName) => {
  return apiClient.post("/api/Roles/remove", { userId, roleName });
};

export const getUserRoles = (userId) => {
  return apiClient.get(`/api/Roles/user/${userId}`);
};

// --- Rooms ---
export const getGlobalRoomStats = () => {
  return apiClient.get("/api/Rooms/stats/global");
};

export const getMyRoomStats = () => {
  return apiClient.get("/api/Rooms/stats/me");
};

export const getUserRoomStats = (userId) => {
  return apiClient.get(`/api/Rooms/stats/user/${userId}`);
};

export const getTeammateRoomStats = () => {
  return apiClient.get("/api/Rooms/stats/teammates");
};

export const registerCard = (cardData) => {
  return apiClient.post("/api/Rooms/register-card", cardData);
};

export const forceCheckout = (checkoutData) => {
  return apiClient.post("/api/Rooms/force-checkout", checkoutData);
};

export const cardScan = (scanData) => {
  return apiClient.post("/api/Rooms/card-scan", scanData);
};

export const roomButtonPress = (buttonUid) => {
  return apiClient.post("/api/Rooms/button-press", { buttonUid });
};

export const getDoorStatus = (roomId) => {
  return apiClient.get(`/api/Rooms/${roomId}/door-status`);
};

export const updateRoomAccessMode = (roomId, mode) => {
  return apiClient.put(`/api/Rooms/${roomId}/access-mode`, { mode });
};

export const getRoomAccessMode = (roomId) => {
  return apiClient.get(`/api/Rooms/${roomId}/access-mode`);
};

// --- Electricity ---
export const controlElectricity = (controlData) => {
  return apiClient.post("/api/Electricity/control", controlData);
};

export const electricityButtonPress = (pressData) => {
  return apiClient.post("/api/Electricity/button-press", pressData);
};

export const getElectricityStatus = (deviceId) => {
  return apiClient.get(`/api/Electricity/${deviceId}/status`);
};

// --- Notifications ---
export const registerFcmToken = (tokenData) => {
  return apiClient.post("/api/Notifications/register-token", tokenData);
};

export const unregisterFcmToken = () => {
  return apiClient.delete("/api/Notifications/unregister-token");
};

// --- Reports ---
export const createReportRequest = (requestData) => {
  return apiClient.post("/api/Reports/requests", requestData);
};

export const getMyReportRequests = (params) => {
  return apiClient.get("/api/Reports/requests/me", { params });
};

export const getReportRequestById = (id) => {
  return apiClient.get(`/api/Reports/requests/${id}`);
};

export const uploadReport = (formData) => {
  return apiClient.post("/api/Reports/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const submitReportJson = (reportData) => {
  return apiClient.post("/api/Reports/upload", reportData);
};

export const getReportDownloadUrl = (id) => {
  return apiClient.get(`/api/Reports/${id}/download-url`);
};

export const reviewReport = (id, reviewData) => {
  return apiClient.put(`/api/Reports/${id}/review`, reviewData);
};

export const getReportById = (id) => {
  return apiClient.get(`/api/Reports/${id}`);
};

export const getAdminReportRequests = (params) => {
  return apiClient.get("/api/Reports/requests/admin", { params });
};

export default apiClient;
