/**
 * API path constants to ensure consistency across components
 */

// Auth endpoints
export const AUTH_PATHS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  VERIFY: '/api/auth/verify'
};

// Blog endpoints
export const BLOG_PATHS = {
  ALL: '/api/blogs',
  SINGLE: (id) => `/api/blogs/${id}`,
  BY_CATEGORY: (category) => `/api/blogs?category=${category}`,
  BY_TAG: (tag) => `/api/blogs?tag=${tag}`,
  CREATE: '/api/blogs',
  UPDATE: (id) => `/api/blogs/${id}`,
  DELETE: (id) => `/api/blogs/${id}`,
  RELATED: (id, limit = 3) => `/api/blogs/related/${id}?limit=${limit}`
};

// SDE Sheet endpoints
export const SDE_SHEET_PATHS = {
  PROBLEMS: '/sde-sheet/problems',
  PROBLEMS_ALT: '/api/sde-sheet/problems',
  PROGRESS: '/sde-sheet/progress',
  PROGRESS_ALT: '/api/sde-sheet/progress',
  UPDATE_PROGRESS: (problemId) => `/sde-sheet/progress/${problemId}`,
  UPDATE_PROGRESS_ALT: (problemId) => `/api/sde-sheet/progress/${problemId}`,
  UPDATE_BOOKMARK: (problemId) => `/sde-sheet/progress/${problemId}/bookmark`,
  UPDATE_BOOKMARK_ALT: (problemId) => `/api/sde-sheet/progress/${problemId}/bookmark`,
  BOOKMARK: (problemId) => `/sde-sheet/bookmark/${problemId}`,
  BOOKMARK_ALT: (problemId) => `/api/sde-sheet/bookmark/${problemId}`,
  STATS: '/sde-sheet/statistics',
  STATS_ALT: '/api/sde-sheet/statistics'
};

// User endpoints
export const USER_PATHS = {
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
  SOLVED_PROBLEMS: '/api/users/solved-problems'
};

// Newsletter endpoints
export const NEWSLETTER_PATHS = {
  SUBSCRIBE: '/api/newsletter/subscribe',
  UNSUBSCRIBE: '/api/newsletter/unsubscribe'
};

// Testimonial endpoints
export const TESTIMONIAL_PATHS = {
  ALL: '/api/testimonials'
};

export default {
  AUTH: AUTH_PATHS,
  BLOGS: BLOG_PATHS,
  SDE_SHEET: SDE_SHEET_PATHS,
  USER: USER_PATHS,
  NEWSLETTER: NEWSLETTER_PATHS,
  TESTIMONIAL: TESTIMONIAL_PATHS
}; 