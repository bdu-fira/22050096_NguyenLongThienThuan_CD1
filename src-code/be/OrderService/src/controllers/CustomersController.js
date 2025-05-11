const CustomersService = require('../services/CustomersService');

// Create a new Customer
exports.create = async (req, res, next) => {
  try {
    const data = await CustomersService.createCustomer(req.body,res.locals.user.iduser);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// Get all Customers
exports.findAll = async (req, res, next) => {
  try {
    // Pass the requesting user information for authorization
    const requestingUser = res.locals.user;
    const data = await CustomersService.getAllCustomers(null, requestingUser);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get a Customer by ID
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
     // Pass the requesting user information for authorization
    const requestingUser = res.locals.user;

    const data = await CustomersService.getCustomerById(id, requestingUser);
    if (!data) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get a Customer by ID User
exports.findOneByIdUser = async (req, res, next) => {
  try {
    const iduser = req.params.iduser;
    const data = await CustomersService.getCustomerByIdUser(iduser);
    if (!data) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Update a Customer by ID
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
     // Pass the requesting user information for authorization
    const requestingUser = res.locals.user;
    const data = await CustomersService.updateCustomer(id, req.body, requestingUser);
    if (!data) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Delete a Customer by ID
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await CustomersService.deleteCustomer(id);
    if (!data) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};