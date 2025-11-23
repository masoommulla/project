// API Configuration and Helper Functions
import { API_URL } from '../config';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove auth token from localStorage
const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
  }) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: { user: any; token: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      setToken(response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: { user: any; token: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      setToken(response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Verify token
  verify: async () => {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: { user: any };
    }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (response.data?.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }

    return response;
  },

  // Logout
  logout: () => {
    removeToken();
  },

  // Forgot Password - Send OTP
  forgotPassword: async (email: string) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response;
  },

  // Verify OTP
  verifyOtp: async (email: string, otp: string) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    return response;
  },

  // Reset Password
  resetPassword: async (email: string, newPassword: string) => {
    const response = await apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });

    return response;
  },
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiRequest<{ success: boolean; data: any }>('/users/me');
  },

  // Update user profile
  updateProfile: async (data: any) => {
    return apiRequest<{ success: boolean; data: any }>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Change password
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest<{ success: boolean; message: string }>(
      '/users/me/password',
      {
        method: 'PUT',
        body: JSON.stringify(passwords),
      }
    );
  },

  // Update avatar
  updateAvatar: async (avatar: string) => {
    return apiRequest<{ success: boolean; message: string; data: any }>(
      '/users/me/avatar',
      {
        method: 'PUT',
        body: JSON.stringify({ avatar }),
      }
    );
  },

  // Daily check-in
  checkIn: async () => {
    return apiRequest<{ success: boolean; data: any }>('/users/me/check-in', {
      method: 'POST',
    });
  },

  // Update subscription
  updateSubscription: async (plan: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      '/users/me/subscription',
      {
        method: 'PUT',
        body: JSON.stringify({ plan }),
      }
    );
  },

  // Delete account
  deleteAccount: async () => {
    return apiRequest<{ success: boolean; message: string }>('/users/me', {
      method: 'DELETE',
    });
  },
};

// ============================================
// MOOD TRACKING API
// ============================================

export const moodAPI = {
  // Create mood entry
  create: async (moodData: {
    mood: string;
    intensity: number;
    emotions?: string[];
    activities?: string[];
    notes?: string;
    energy?: number;
    sleep?: { hours: number; quality: string };
    social?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  },

  // Alias for create to match component usage
  addMood: async (moodData: {
    mood: string;
    intensity: number;
    emotions?: string[];
    activities?: string[];
    notes?: string;
    energy?: number;
    sleep?: { hours: number; quality: string };
    social?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  },

  // Get all mood entries
  getAll: async (params?: { limit?: number; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/moods${query ? `?${query}` : ''}`
    );
  },

  // Alias for getAll to match component usage
  getMoods: async () => {
    return apiRequest<{ success: boolean; data: any[]; count: number }>('/moods');
  },

  // Get mood statistics
  getStats: async (days: number = 30) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/moods/stats?days=${days}`
    );
  },

  // Get single mood entry
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/moods/${id}`);
  },

  // Update mood entry
  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/moods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete mood entry
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/moods/${id}`, {
      method: 'DELETE',
    });
  },

  // Alias for delete to match component usage
  deleteMood: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/moods/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// JOURNAL API
// ============================================

export const journalAPI = {
  // Create journal entry
  create: async (journalData: {
    title: string;
    content: string;
    mood?: string;
    tags?: string[];
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/journals', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  },

  // Get all journals
  getAll: async (params?: { limit?: number; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/journals${query ? `?${query}` : ''}`
    );
  },

  // Get journal statistics
  getStats: async () => {
    return apiRequest<{ success: boolean; data: any }>('/journals/stats');
  },

  // Search journals
  search: async (query: string) => {
    return apiRequest<{ success: boolean; data: any[] }>(
      `/journals/search?q=${encodeURIComponent(query)}`
    );
  },

  // Get single journal
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/journals/${id}`);
  },

  // Update journal
  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Toggle favorite
  toggleFavorite: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/journals/${id}/favorite`,
      {
        method: 'PATCH',
      }
    );
  },

  // Delete journal
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/journals/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ============================================
// THERAPIST API
// ============================================

export const therapistAPI = {
  // Get all therapists
  getAll: async (params?: { specialty?: string; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/therapists${query ? `?${query}` : ''}`
    );
  },

  // Get featured therapists
  getFeatured: async () => {
    return apiRequest<{ success: boolean; data: any[] }>(
      '/therapists/featured'
    );
  },

  // Search therapists
  search: async (query: string) => {
    return apiRequest<{ success: boolean; data: any[] }>(
      `/therapists/search?q=${encodeURIComponent(query)}`
    );
  },

  // Get single therapist
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/therapists/${id}`);
  },
};

// ============================================
// APPOINTMENT API
// ============================================

export const appointmentAPI = {
  // Book appointment
  create: async (appointmentData: {
    therapistId: string;
    dateTime: string;
    sessionType: string;
    notes?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  // Get all appointments
  getAll: async () => {
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      '/appointments'
    );
  },

  // Get upcoming appointments
  getUpcoming: async () => {
    return apiRequest<{ success: boolean; data: any[] }>(
      '/appointments/upcoming'
    );
  },

  // Get appointment statistics
  getStats: async () => {
    return apiRequest<{ success: boolean; data: any }>('/appointments/stats');
  },

  // Get single appointment
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/appointments/${id}`);
  },

  // Update appointment
  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Cancel appointment
  cancel: async (id: string, reason?: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/appointments/${id}/cancel`,
      {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      }
    );
  },

  // Mark as completed
  complete: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/appointments/${id}/complete`,
      {
        method: 'PATCH',
      }
    );
  },

  // Add review
  addReview: async (id: string, review: { rating: number; comment: string }) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/appointments/${id}/review`,
      {
        method: 'POST',
        body: JSON.stringify(review),
      }
    );
  },

  // Delete appointment
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/appointments/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Clear past appointments
  clearPast: async () => {
    return apiRequest<{ success: boolean; message: string; count: number }>(
      '/appointments/past/clear',
      {
        method: 'DELETE',
      }
    );
  },
};

// ============================================
// CHAT API
// ============================================

export const chatAPI = {
  // Create conversation
  createConversation: async (data: {
    participantId: string;
    type: 'ai' | 'therapist';
  }) => {
    return apiRequest<{ success: boolean; data: any }>(
      '/chats/conversations',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Get all conversations
  getConversations: async () => {
    return apiRequest<{ success: boolean; data: any[] }>(
      '/chats/conversations'
    );
  },

  // Get single conversation
  getConversation: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/chats/conversations/${id}`
    );
  },

  // Delete conversation
  deleteConversation: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/chats/conversations/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Send message
  sendMessage: async (conversationId: string, message: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/chats/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
  },

  // Get messages
  getMessages: async (conversationId: string) => {
    return apiRequest<{ success: boolean; data: any[] }>(
      `/chats/${conversationId}/messages`
    );
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiRequest<{ success: boolean; count: number }>(
      '/chats/messages/unread'
    );
  },

  // Mark message as read
  markAsRead: async (messageId: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/chats/messages/${messageId}/read`,
      {
        method: 'PATCH',
      }
    );
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    return apiRequest<{ success: boolean; message: string }>(
      `/chats/messages/${messageId}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ============================================
// RESOURCES API
// ============================================

export const resourceAPI = {
  // Get all resources
  getAll: async (params?: { category?: string; type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/resources${query ? `?${query}` : ''}`
    );
  },

  // Get featured resources
  getFeatured: async () => {
    return apiRequest<{ success: boolean; data: any[] }>(
      '/resources/featured'
    );
  },

  // Search resources
  search: async (query: string) => {
    return apiRequest<{ success: boolean; data: any[] }>(
      `/resources/search?q=${encodeURIComponent(query)}`
    );
  },

  // Get categories
  getCategories: async () => {
    return apiRequest<{ success: boolean; data: string[] }>(
      '/resources/categories'
    );
  },

  // Get single resource
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/resources/${id}`);
  },

  // Like resource
  like: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/resources/${id}/like`,
      {
        method: 'PATCH',
      }
    );
  },

  // Increment download count
  download: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(
      `/resources/${id}/download`,
      {
        method: 'PATCH',
      }
    );
  },
};

// ============================================
// CHAT HISTORY API (Botpress Integration)
// ============================================

export const chatHistoryAPI = {
  // Save a chat message
  save: async (messageData: {
    message: string;
    fromBot: boolean;
    timestamp?: string;
    conversationId?: string;
    messageId?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/chat/save', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Get chat history for authenticated user
  getHistory: async (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/chat/history${query}`
    );
  },

  // Delete chat history
  deleteHistory: async () => {
    return apiRequest<{ success: boolean; message: string; deletedCount: number }>(
      '/chat/history',
      {
        method: 'DELETE',
      }
    );
  },

  // Get chat statistics
  getStats: async () => {
    return apiRequest<{ success: boolean; data: any }>('/chat/stats');
  },
};

// ============================================
// TODO API
// ============================================

export const todoAPI = {
  // Create todo
  create: async (todoData: {
    text: string;
    category?: string;
    priority?: string;
    dueDate?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  },

  // Get all todos
  getAll: async (params?: { completed?: boolean; category?: string; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/todos${query ? `?${query}` : ''}`
    );
  },

  // Get todo statistics
  getStats: async () => {
    return apiRequest<{ success: boolean; data: any }>('/todos/stats');
  },

  // Get single todo
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/todos/${id}`);
  },

  // Update todo
  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Toggle completion
  toggle: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Delete todo
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// STUDY PLAN API
// ============================================

export const studyPlanAPI = {
  // Create study plan
  create: async (studyPlanData: {
    subject: string;
    topic: string;
    duration: number;
    notes?: string;
    date?: string;
  }) => {
    return apiRequest<{ success: boolean; data: any }>('/study-plans', {
      method: 'POST',
      body: JSON.stringify(studyPlanData),
    });
  },

  // Get all study plans
  getAll: async (params?: { completed?: boolean; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest<{ success: boolean; data: any[]; count: number }>(
      `/study-plans${query ? `?${query}` : ''}`
    );
  },

  // Get study plan statistics
  getStats: async () => {
    return apiRequest<{ success: boolean; data: any }>('/study-plans/stats');
  },

  // Get single study plan
  getOne: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/study-plans/${id}`);
  },

  // Update study plan
  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; data: any }>(`/study-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Toggle completion
  toggle: async (id: string) => {
    return apiRequest<{ success: boolean; data: any }>(`/study-plans/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Delete study plan
  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/study-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export all APIs
export default {
  auth: authAPI,
  user: userAPI,
  mood: moodAPI,
  journal: journalAPI,
  therapist: therapistAPI,
  appointment: appointmentAPI,
  chat: chatAPI,
  resource: resourceAPI,
  chatHistory: chatHistoryAPI, // Botpress chat history
  todo: todoAPI,
  studyPlan: studyPlanAPI,
};