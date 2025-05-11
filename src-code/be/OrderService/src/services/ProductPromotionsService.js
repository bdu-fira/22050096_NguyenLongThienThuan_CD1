const { ProductPromotions } = require('../models');
const { Products } = require('../models');
const { Promotions } = require('../models');

// Function to find all promotions applied to a specific product
async function findPromotionsByProductId(productId) {
  try {
    const productPromotions = await ProductPromotions.findAll({
      where: {
        product_id: productId,
      },
      include: [{ model: Promotions, as: 'Promotion' }], // Assuming you have an alias 'Promotion' in your association
    });

    return productPromotions.map(pp => pp.Promotion);
  } catch (error) {
    throw new Error('Failed to find promotions by product ID: ' + error.message);
  }
}

// Function to find all products associated with a specific promotion
async function findProductsByPromotionId(promoId) {
  try {
    const productPromotions = await ProductPromotions.findAll({
      where: {
        promo_id: promoId,
      },
      include: [{ model: Products, as: 'Product' }], // Assuming you have an alias 'Product' in your association
    });

    return productPromotions.map(pp => pp.Product);
  } catch (error) {
    throw new Error('Failed to find products by promotion ID: ' + error.message);
  }
}

// Function to bulk add product promotions
async function bulkAddProductPromotions(data) {
  try {
    await ProductPromotions.bulkCreate(data);
  } catch (error) {
    throw new Error('Failed to bulk add product promotions: ' + error.message);
  }
}

module.exports = {
  findPromotionsByProductId,
  findProductsByPromotionId,
  bulkAddProductPromotions
};