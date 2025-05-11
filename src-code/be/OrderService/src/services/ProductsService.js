const db = require('../models/index');
const Products = db.Products;
const Categories = db.Categories;

const createProduct = async (data) => {
  try {
    const product = await Products.create(data);
    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async (options = {}) => {
  try {
    // Add include for Category if needed.
    const products = await Products.findAll();
    return products;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    const product = await Products.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, data) => {
  try {
    const product = await Products.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await product.update(data);
    return product;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await Products.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await product.destroy();
  } catch (error) {
    throw error;
  }
};

const updateStockQuantity = async (id, change) => {
  try {
    const product = await Products.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = product.stock_quantity + change;

    if (newQuantity < 0) {
      throw new Error('Insufficient stock');
    }

    await product.update({ stock_quantity: newQuantity });
    return product;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStockQuantity,
};
