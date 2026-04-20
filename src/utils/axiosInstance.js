import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * Senior Architect Note: Using VITE_API_KEY as the baseURL. 
 * Recommendation: Rename this environment variable to VITE_API_BASE_URL for clarity.
 */
const BASE_URL = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Singleton promise to track the initial Firebase Auth state resolution.
// This prevents multiple requests from triggering redundant listeners.
let authInitializedPromise = null;

const getAuthUser = () => {
  // If user is already available, resolve immediately.
  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  // If we've already started waiting, return the existing promise.
  if (authInitializedPromise) return authInitializedPromise;

  // Otherwise, create a new listener for the initial state.
  authInitializedPromise = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  return authInitializedPromise;
};

// Request Interceptor: Attach Firebase Token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Wait for auth to initialize before proceeding with the request.
      const user = await getAuthUser();

      if (user) {
        // Retrieve a fresh ID token.
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error("Auth Token Interceptor Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized logging for API failures.
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized: Session may have expired.");
      } else if (status === 403) {
        console.error("Forbidden: You do not have permission for this resource.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
