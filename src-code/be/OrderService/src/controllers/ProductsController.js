const ProductsService = require('../services/ProductsService');

// Create a new product
const create = async (req, res, next) => {
  try {
    const product = await ProductsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Get all products
const findAll = async (req, res, next) => {
  try {
    const products = await ProductsService.getAllProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Get a product by ID
const findOne = async (req, res, next) => {
  try {
    const product = await ProductsService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Update a product
const update = async (req, res, next) => {
  try {
    const product = await ProductsService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// // Delete a product
const remove = async (req, res, next) => {
  try {
    const deleted = await ProductsService.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  remove,
  update,
};
