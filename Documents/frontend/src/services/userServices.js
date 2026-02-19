// src/services/userService.js
import api from "./api";

// ✅ Get all users (ADMIN) with pagination
export const getUsers = async (page = 1, limit = 6, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  const url = `/auth/users?${params}`;
  console.log('API URL being called:', url); // Debug URL
  
  try {
    const { data } = await api.get(url);
    console.log('API Response from service:', data); // Debug response
    return data;
  } catch (error) {
    console.error('API Error in service:', error); // Debug error
    throw error;
  }
};

// ✅ Get single user
export const getUserById = async (userId) => {
  try {
    // Try direct API call first (most efficient)
    const endpoints = [
      `/auth/users/${userId}`,
      `/users/${userId}`,
      `/user/${userId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        if (response.data) {
          return response.data;
        }
      } catch (error) {
        continue;
      }
    }
    
    // If direct calls fail, try getting all users and finding the user
    const allUsersResponse = await api.get("/auth/users");
    let allUsers = allUsersResponse.data;
    
    // Handle different response formats
    if (allUsers.users && Array.isArray(allUsers.users)) {
      allUsers = allUsers.users;
    } else if (!Array.isArray(allUsers)) {
      throw new Error(`Invalid response format: expected array but got ${typeof allUsers}`);
    }
    
    // Find the user by ID in the list
    const user = allUsers.find(u => u._id === userId || u.id === userId);
    
    if (user) {
      return user;
    } else {
      throw new Error(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};

// ✅ Create user (if backend supports it)
export const createUser = async (userData) => {
  const { data } = await api.post("/auth/users", userData);
  return data;
};

// ✅ Update user
export const updateUser = async (userId, userData) => {
  const { data } = await api.put(`/auth/users/${userId}`, userData);
  return data;
};

// ✅ Delete user
export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/auth/users/${userId}`);
  return data;
};

// ✅ Update user status
export const updateUserStatus = async (userId, status) => {
  const { data } = await api.patch(`/auth/users/${userId}/status`, { status });
  return data;
};
export const updateProfile = async (profileData) => {
  try {
    const { data } = await api.put("/auth/profile", profileData);
    console.log("data",profileData)
    return { success: true, user: data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message,
    };
  }
};

// ✅ Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const { data } = await api.get("/auth/dashboard/stats");
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// ✅ Get recently active users
export const getRecentActiveUsers = async () => {
  try {
    const { data } = await api.get("/auth/users/recent");
    return data;
  } catch (error) {
    console.error('Error fetching recent active users:', error);
    throw error;
  }
};
