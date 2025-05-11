const db = require('../models/index');
const PromotionTypes = db.PromotionTypes;

const createPromotionType = async (data) => {
  try {
    const promotionType = await PromotionTypes.create(data);
    return promotionType;
  } catch (error) {
    throw error;
  }
};

const getAllPromotionTypes = async (options = {}) => {
  try {
    const promotionTypes = await PromotionTypes.findAll(options);
    return promotionTypes;
  } catch (error) {
    throw error;
  }
};

const getPromotionTypeById = async (id) => {
  try {
    const promotionType = await PromotionTypes.findByPk(id);
    if (!promotionType) {
      throw new Error('PromotionType not found');
    }
    return promotionType;
  } catch (error) {
    throw error;
  }
};

const updatePromotionType = async (id, data) => {
  try {
    const promotionType = await PromotionTypes.findByPk(id);
    if (!promotionType) {
      throw new Error('PromotionType not found');
    }
    await promotionType.update(data);
    return promotionType;
  } catch (error) {
    throw error;
  }
};

const deletePromotionType = async (id) => {
  try {
    const promotionType = await PromotionTypes.findByPk(id);
    if (!promotionType) {
      throw new Error('PromotionType not found');
    }
    await promotionType.destroy();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPromotionType,
  getAllPromotionTypes,
  getPromotionTypeById,
  updatePromotionType,
  deletePromotionType,
};
