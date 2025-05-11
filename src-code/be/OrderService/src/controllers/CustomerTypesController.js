const CustomerTypesService = require('../services/CustomerTypesService');

// Create a new CustomerType
exports.create = async (req, res, next) => {
  try {
    const data = await CustomerTypesService.createCustomerType(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// Get all CustomerTypes
exports.findAll = async (req, res, next) => {
  try {
    const data = await CustomerTypesService.getAllCustomerTypes();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get a CustomerType by ID
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await CustomerTypesService.getCustomerTypeById(id);
    if (!data) {
      return res.status(404).json({ message: 'CustomerType not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Update a CustomerType by ID
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await CustomerTypesService.updateCustomerType(id, req.body);
    if (!data) {
      return res.status(404).json({ message: 'CustomerType not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Delete a CustomerType by ID
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await CustomerTypesService.deleteCustomerType(id);
    if (!data) {
      return res.status(404).json({ message: 'CustomerType not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};