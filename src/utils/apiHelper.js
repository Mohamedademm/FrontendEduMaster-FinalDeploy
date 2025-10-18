import config from '../config/config';

/**
 * API Helper - Centralized API URL management
 * Use this instead of hardcoded localhost URLs
 */

// Get the base API URL
export const getApiUrl = (endpoint = '') => {
  const baseUrl = config.API_BASE_URL;
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Get the backend URL (for images and resources)
export const getBackendUrl = (path = '') => {
  const backendUrl = config.BACKEND_URL;
  // Handle paths that already start with http
  if (path.startsWith('http')) {
    return path;
  }
  // Add leading slash if not present
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendUrl}${cleanPath}`;
};

// Get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  return getBackendUrl(imagePath);
};

// API endpoints object for easy reference
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    google: 'auth/google',
    verifyEmail: 'auth/verify-email',
    verifyToken: 'auth/verifyToken',
  },
  // Courses
  courses: {
    all: 'courses',
    byId: (id) => `courses/${id}`,
    byTeacher: (teacherId) => `courses/teacher/${teacherId}`,
    rate: (id) => `courses/${id}/rate`,
    validate: (id) => `courses/${id}/validate`,
    tests: 'courses/tests',
    testById: (id) => `courses/tests/${id}`,
  },
  // Micro courses
  microCourses: {
    all: 'micro-courses',
    byId: (id) => `micro-courses/${id}`,
    order: 'micro-courses/order',
  },
  // Users
  users: {
    all: 'users',
    byId: (id) => `users/${id}`,
    career: 'users/career',
    addCourse: 'users/add-course',
    completeCourse: 'users/complete-course',
    addRoadmap: 'users/add-roadmap',
  },
  // Roadmaps
  roadmaps: {
    all: 'roadmaps',
    byId: (id) => `roadmaps/${id}`,
    create: 'roadmaps/create',
  },
  // Notifications
  notifications: {
    byTeacher: (teacherId) => `notifications/${teacherId}`,
    markRead: (notificationId) => `notifications/${notificationId}/read`,
    markAllRead: (teacherId) => `notifications/teacher/${teacherId}/mark-all-read`,
  },
  // Bank accounts
  bankAccounts: {
    byTeacher: (teacherId) => `bank-accounts/${teacherId}`,
  },
  // Online classes
  onlineClasses: {
    all: 'online-classes',
  },
  // Support tickets
  supportTickets: {
    all: 'support-tickets',
    byId: (id) => `support-tickets/${id}`,
  },
  // Contact
  contact: {
    all: 'contact',
    byId: (id) => `contact/${id}`,
    markRead: (id) => `contact/${id}/read`,
    respond: (id) => `contact/${id}/respond`,
  },
  // Podcasts
  podcasts: {
    featured: 'podcasts/featured/popular',
    search: 'podcasts/search',
  },
  // PayPal
  paypal: {
    createOrder: 'paypal/create-order',
  },
  // Payments
  payments: {
    checkAccess: (userId, courseId) => `payments/check-access/${userId}/${courseId}`,
  },
  // Gemini AI
  gemini: 'gemini',
  // Scraped data
  scrapedData: 'scraped-data',
  // Job offers
  jobOffers: 'job-offers',
};

const apiHelper = {
  getApiUrl,
  getBackendUrl,
  getImageUrl,
  API_ENDPOINTS,
};

export default apiHelper;
