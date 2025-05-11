const PromotionTypesService = require('../services/PromotionTypesService');

// Create a new promotion type
const create = async (req, res, next) => {
  try {
    const promotionType = await PromotionTypesService.createPromotionType(req.body);
    res.status(201).json(promotionType);
  } catch (error) {
    next(error);
  }
};

// Get all promotion types
const findAll = async (req, res, next) => {
  try {
    const promotionTypes = await PromotionTypesService.getAllPromotionTypes(req.query);
    res.status(200).json(promotionTypes);
  } catch (error) {
    next(error);
  }
};

// Get a promotion type by ID
const findOne = async (req, res, next) => {
  try {
    const promotionType = await PromotionTypesService.getPromotionTypeById(req.params.id);
    if (!promotionType) {
      return res.status(404).json({ message: 'Promotion Type not found' });
    }
    res.status(200).json(promotionType);
  } catch (error) {
    next(error);
  }
};

// Update a promotion type
const update = async (req, res, next) => {
  try {
    const promotionType = await PromotionTypesService.updatePromotionType(req.params.id, req.body);
    if (!promotionType) {
      return res.status(404).json({ message: 'Promotion Type not found' });
    }
    res.status(200).json(promotionType);
  } catch (error) {
    next(error);
  }
};

// Delete a promotion type
const remove = async (req, res, next) => {
  try {
    const deleted = await PromotionTypesService.deletePromotionType(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Promotion Type not found' });
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
  update,
  remove
};
