import apiClient from "./api";

/**
 * @fileoverview Service for managing Announcements API interactions.
 * Uses the centralized apiClient for requests to ensure auth headers and error handling are applied.
 */

/**
 * Fetch paginated announcements for the current user.
 * 
 * @param {number} pageNumber - The page number to fetch (1-based index).
 * @param {number} pageSize - The number of items per page.
 * @param {boolean|null} [isRead=null] - Optional filter. Pass `true` for read, `false` for unread, or `null/undefined` for all.
 * @returns {Promise<Object>} The paginated response containing items and metadata.
 * @throws {Error} Propagates API errors.
 */
export const getMyAnnouncements = async (pageNumber = 1, pageSize = 10, isRead = null) => {
  try {
    const params = {
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    if (isRead !== null && isRead !== undefined) {
      params.isRead = isRead;
    }

    const response = await apiClient.get("/api/Announcements/my", { params });
    return response.data;
  } catch (error) {
    // Error is logged/handled by the interceptor in api.js, but we re-throw 
    // so the component can update its UI state (e.g., stop loading spinner).
    throw error;
  }
};

/**
 * Mark a specific announcement as read.
 * 
 * @param {string} id - The UUID of the announcement to mark as read.
 * @returns {Promise<void>} Resolves when the operation is successful.
 * @throws {Error} Propagates API errors.
 */
export const markAsRead = async (id) => {
  try {
    await apiClient.put(`/api/Announcements/${id}/read`);
  } catch (error) {
    throw error;
  }
};

/**
 * Get full details of a specific announcement.
 * 
 * @param {string} id - The UUID of the announcement.
 * @returns {Promise<Object>} The detailed announcement object.
 * @throws {Error} Propagates API errors.
 */
export const getAnnouncementById = async (id) => {
  try {
    const response = await apiClient.get(`/api/Announcements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new announcement.
 * 
 * @param {Object} announcementData - The announcement payload.
 * @param {string} announcementData.title - Title of the announcement.
 * @param {string} announcementData.content - HTML or text content.
 * @param {number} announcementData.scope - Scope enum (e.g., 0: General, 1: Project, 2: User).
 * @param {string[]} [announcementData.targetProjectIds] - Array of Project UUIDs (if scope implies).
 * @param {string[]} [announcementData.targetUserIds] - Array of User UUIDs (if scope implies).
 * @returns {Promise<string>} The UUID of the created announcement.
 * @throws {Error} Propagates API errors.
 */
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await apiClient.post("/api/Announcements", announcementData);
    return response.data; // Assuming API returns the ID string directly or in an object
  } catch (error) {
    throw error;
  }
};
