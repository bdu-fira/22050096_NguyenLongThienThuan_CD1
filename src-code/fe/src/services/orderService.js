// src/api/orderService.js
import axios from './api';

const fetchProducts = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCustomerByUser = async (iduser) => {
  try {
    const response = await axios.get(`/orderService/api/v1/customers/user/${iduser}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchPromotions = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/promotions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createOrder = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/orders`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async (id,data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/orders/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCustomerOrders = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/orders/customer/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchOrderById = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchEmployeeOrders = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(`/orderService/api/v1/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCustomer = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/customers`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (id, data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/customers/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCatagory = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchCustomerTypes = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/customer-types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchCustomer = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/customers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const createProduct = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/products`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/products/${data.product_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`/orderService/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const createPromotion = async (data) => {
  const response = await axios.post(`/orderService/api/v1/promotions`, data);
  return response.data;
};

const updatePromotion = async (data) => {
  const response = await axios.put(`/orderService/api/v1/promotions/${data.promo_id}`, data);
  return response.data;
};

const deletePromotion = async (id) => {
  const response = await axios.delete(`/orderService/api/v1/promotions/${id}`);
  return response.data;
};
const fetchPromotionTypes = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/promotion-types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Lấy tất cả nhân viên (Admin only)
const fetchEmployees = async () => {
  try {
    const response = await axios.get(`/orderService/api/v1/employees`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin nhân viên theo staff_id
const fetchEmployeeById = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin nhân viên theo iduser
const fetchEmployeeByUser = async (iduser) => {
  try {
    const response = await axios.get(`/orderService/api/v1/employees/user/${iduser}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo nhân viên mới (Admin only)
const createEmployee = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/employees`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin nhân viên theo staff_id (Admin only)
const updateEmployee = async (staff_id,data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/employees/${staff_id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xoá nhân viên theo staff_id (nếu có route mở)
const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`/orderService/api/v1/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCategory = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/categories`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/orderService/api/v1/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const fetchCustomerTypeById = async (id) => {
  try {
    const response = await axios.get(`/orderService/api/v1/customer-types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCustomerType = async (data) => {
  try {
    const response = await axios.post(`/orderService/api/v1/customer-types`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật loại khách hàng
const updateCustomerType = async (id, data) => {
  try {
    const response = await axios.put(`/orderService/api/v1/customer-types/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xoá loại khách hàng
const deleteCustomerType = async (id) => {
  try {
    const response = await axios.delete(`/orderService/api/v1/customer-types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createCategory,      
  updateCategory,      
  deleteCategory,    
  fetchPromotionTypes,
  fetchProducts,
  fetchProductById,
  fetchPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  createOrder,
  updateOrder,
  fetchCustomerOrders,
  fetchOrderById,
  fetchEmployeeOrders,
  updateOrderStatus,
  fetchCustomerByUser,
  createCustomer,
  updateCustomer,
  fetchCatagory,
  fetchCategoryById,
  fetchCustomerTypes,
  fetchCustomer,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchEmployees,
  fetchEmployeeById,
  fetchEmployeeByUser,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchCustomerTypeById,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
};
