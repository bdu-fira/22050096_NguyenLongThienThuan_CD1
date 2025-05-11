import axios from './api';

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`/authService/api/v1/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (payload) => {
  try {
    console.log(payload);

    const response = await axios.post(`/authService/api/v1/auth/register`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (payload) => {
  try {
    const response = await axios.post(`/authService/api/v1/auth/change-password`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const forgotPassword = async (payload) => {
  try {
    const response = await axios.post(`/authService/api/v1/auth/forgot-password`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    const response = await axios.get(`/authService/api/v1/auth/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get(`/authService/api/v1/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get(`/authService/api/v1/roles`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const assignRoleToUser = async (data) => {
  try {
    const response = await axios.post(`/authService/api/v1/role-users`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const removeRoleFromUser = async (iduser, idRole) => {
  try {
    const response = await axios.delete(`/authService/api/v1/role-users/user/${iduser}/role/${idRole}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// ------- ROLE SERVICES -------
const createRole = async (data) => {
  const response = await axios.post(`/authService/api/v1/roles`, data);
  return response.data;
};

const updateRole = async (idRole, data) => {
  const response = await axios.put(`/authService/api/v1/roles/${idRole}`, data);
  return response.data;
};

const deleteRole = async (idRole) => {
  const response = await axios.delete(`/authService/api/v1/roles/${idRole}`);
  return response.data;
};

const fetchRoleById = async (idRole) => {
  const response = await axios.get(`/authService/api/v1/roles/${idRole}`);
  return response.data;
};

// ------- ROLE-USER SERVICES -------
const fetchAllRoleUsers = async () => {
  const response = await axios.get(`/authService/api/v1/role-users`);
  return response.data;
};

const fetchRoleUserById = async (idRoleUser) => {
  const response = await axios.get(`/authService/api/v1/role-users/${idRoleUser}`);
  return response.data;
};

const fetchRolesByUserId = async (iduser) => {
  const response = await axios.get(`/authService/api/v1/role-users/user/${iduser}`);
  return response.data;
};

const fetchUsersByRoleId = async (idRole) => {
  const response = await axios.get(`/authService/api/v1/role-users/role/${idRole}`);
  return response.data;
};

const deleteRoleUserById = async (idRoleUser) => {
  const response = await axios.delete(`/authService/api/v1/role-users/${idRoleUser}`);
  return response.data;
};

// ------- USER SERVICES -------
const createUser = async (data) => {
  const response = await axios.post(`/authService/api/v1/users`, data);
  return response.data;
};

const updateUser = async (iduser, data) => {
  const response = await axios.put(`/authService/api/v1/users/${iduser}`, data);
  return response.data;
};

const deleteUser = async (iduser) => {
  const response = await axios.delete(`/authService/api/v1/users/${iduser}`);
  return response.data;
};

const fetchUserById = async (iduser) => {
  const response = await axios.get(`/authService/api/v1/users/${iduser}`);
  return response.data;
};

export default {
  // Auth
  loginUser,
  registerUser,
  changePassword,
  verifyToken,
  forgotPassword,
  // Users
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUserById,

  // Roles
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchRoleById,

  // RoleUser
  assignRoleToUser,
  removeRoleFromUser,
  fetchAllRoleUsers,
  fetchRoleUserById,
  fetchRolesByUserId,
  fetchUsersByRoleId,
  deleteRoleUserById
};
