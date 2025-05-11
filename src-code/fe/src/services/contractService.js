import api from './api';

const createContract = async (id) => {
  try {
    const response = await api.post(`/orderService/api/v1/orders/contract/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchContracts = async () => {
  try {
    const response = await api.get('/contractService/api/v1/contracts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchContractById = async (id) => {
  try {
    const response = await api.get(`/contractService/api/v1/contracts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export  default{ createContract, fetchContracts, fetchContractById }; 