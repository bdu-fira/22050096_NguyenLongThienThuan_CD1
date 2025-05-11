const db = require('../models/index');
const { Customers, CustomerTypes } = db;

const createCustomer = async (data,iduser) => {
  try {
    // Automatically assign discount_rate based on customer_type_id
    const customerType = await CustomerTypes.findByPk(data.customer_type_id);
    if (customerType) {
      data.discount_rate = customerType.rate_type;
    }

    const customer = await Customers.create({...data,iduser});
    return customer;
  } catch (error) {
    throw error;
  }
};

const getAllCustomers = async (options = {}, requestingUser) => {
  try {
    // Apply authorization logic
    if (requestingUser && requestingUser.roles && !requestingUser.roles.includes('Admin') && !requestingUser.roles.includes('Employee')) {
      options.where = { iduser: requestingUser.iduser };
    }

    const customers = await Customers.findAll();
    return customers;
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (id, requestingUser) => {
  try {
    let customer;
    if (requestingUser && requestingUser.roles && !requestingUser.roles.includes('Admin') && !requestingUser.roles.includes('Employee')) {
      customer = await Customers.findOne({
        where: {
          customer_id: id,
          iduser: requestingUser.iduser,
        },
        include:[{model:CustomerTypes,as:"customerType"}]
      });
    } else {
      customer = await Customers.findOne({where:{customer_id:id},
        include:[{model:CustomerTypes,as:"customerType"}]
      });
    }

    return customer;
  } catch (error) {
    throw error;
  }
};

const getCustomerByIdUser = async (iduser) => {
  try {
    const customer = await Customers.findOne({
      where: { iduser: iduser }, include:[{model:CustomerTypes,as:"customerType"}]
    });
    return customer;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (id, data, requestingUser) => {
  try {
    // Authorization check (Customer can only update their own record)
    if (requestingUser && requestingUser.roles && !requestingUser.roles.includes('Admin') && !requestingUser.roles.includes('Employee')) {
      const customer = await Customers.findByPk(id);
      if (!customer || customer.iduser !== requestingUser.iduser) {
        return null; // Or throw an error, depending on your error handling strategy
      }
    }

    const [updated] = await Customers.update(data, {
      where: { customer_id: id },
    });

    if (updated) {
      const updatedCustomer = await Customers.findByPk(id);
      return updatedCustomer;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteCustomer = async (id) => {
  try {
    const deleted = await Customers.destroy({
      where: { customer_id: id },
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByIdUser,
  updateCustomer,
  deleteCustomer,
};
