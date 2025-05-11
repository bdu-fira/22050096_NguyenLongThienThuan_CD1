const PromotionsService = require('../services/PromotionsService');

const create = async (req, res, next) => {
  try {
    const promotion = await PromotionsService.createPromotion(req.body);
    res.status(201).json(promotion);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const promotions = await PromotionsService.getAllPromotions();
    res.json(promotions);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const promotion = await PromotionsService.getPromotionById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const promotion = await PromotionsService.updatePromotion(req.params.id, req.body);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    next(error);
  }
};



const applyToProduct = async (req, res, next) => {
  try {
    await PromotionsService.applyPromotionToProduct(req.params.promoId, req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const removeFromProduct = async (req, res, next) => {
  try {
    await PromotionsService.removePromotionFromProduct(req.params.promoId, req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  applyToProduct,
  removeFromProduct,
};
