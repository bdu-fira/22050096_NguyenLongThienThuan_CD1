const db = require('../models/index');
const { CustomerTypes } = db;

const createCustomerType = async (data) => {
  try {
    const customerType = await CustomerTypes.create(data);
    return customerType;
  } catch (error) {
    throw error;
  }
};

const getAllCustomerTypes = async (options = {}) => {
  try {
    const customerTypes = await CustomerTypes.findAll(options);
    return customerTypes;
  } catch (error) {
    throw error;
  }
};

const getCustomerTypeById = async (id) => {
  try {
    const customerType = await CustomerTypes.findByPk(id);
    return customerType;
  } catch (error) {
    throw error;
  }
};

const updateCustomerType = async (id, data) => {
  try {
    const [updated] = await CustomerTypes.update(data, {
      where: { customer_type_id: id },
    });
    if (updated) {
      const updatedCustomerType = await CustomerTypes.findByPk(id);
      return updatedCustomerType;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteCustomerType = async (id) => {
  try {
    const deleted = await CustomerTypes.destroy({
      where: { customer_type_id: id },
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCustomerType,
  getAllCustomerTypes,
  getCustomerTypeById,
  updateCustomerType,
  deleteCustomerType,
};
