const CategoriesService = require('../services/CategoriesService');

const create = async (req, res, next) => {
  try {
    const category = await CategoriesService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const categories = await CategoriesService.getAllCategories(req.query);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const category = await CategoriesService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await CategoriesService.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};
const remove = async (req, res, next) => {
  try {
    const deleted = await CategoriesService.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
};
