const { Promotions } = require('../models');
const { PromotionTypes } = require('../models');
const { Products } = require('../models');
const { ProductPromotions } = require('../models');
const { sequelize } = require('../models');

// services/promotionService.js (hoặc controller tương ứng)
async function createPromotion(data) {
  try {
    const { product_ids = [], ...promoData } = data;

    const promotion = await Promotions.create(promoData);

    // Gắn sản phẩm nếu có
    if (product_ids.length > 0) {
      await promotion.setProductPromotions(product_ids); // hoặc create trong bảng trung gian nếu không dùng association
    }

    return promotion;
  } catch (error) {
    throw new Error('Failed to create promotion: ' + error.message);
  }
}


async function getAllPromotions(options = {}) {
  try {
    const promotions = await Promotions.findAll({
      include: [{
        model: Products,
        as: 'productPromotions', // as đã được đặt ở belongsToMany
        through: { attributes: [] } // ẩn bảng trung gian nếu không cần
      },
      {
        model:PromotionTypes,
        as:"promotionType"
      }
    ]
    });
    return promotions;
  } catch (error) {
    throw new Error('Failed to get all promotions: ' + error.message);
  }
}

// Function to get a promotion by ID
async function getPromotionById(id) {
  try {
    const promotion = await Promotions.findByPk(id);
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    return promotion;
  } catch (error) {
    throw new Error('Failed to get promotion by ID: ' + error.message);
  }
}

// Function to update a promotion
async function updatePromotion(id, data) {
  try {
    const { product_ids = [], ...promoData } = data;

    const promotion = await Promotions.findByPk(id, {
      include: ['productPromotions'],
    });

    if (!promotion) {
      throw new Error('Promotion not found');
    }

    // Cập nhật thông tin cơ bản của khuyến mãi
    await promotion.update(promoData);

    // Lấy danh sách product_id hiện tại
    const currentProductIds = promotion.productPromotions?.map(p => p.product_id) || [];

    // Tìm các product_id cần thêm và cần xoá
    const toAdd = product_ids.filter(pid => !currentProductIds.includes(pid));
    const toRemove = currentProductIds.filter(pid => !product_ids.includes(pid));

    // Thêm mới các product
    for (const pid of toAdd) {
      await promotion.addProductPromotion(pid); // Sequelize magic method
    }

    // Xoá các product không còn áp dụng
    for (const pid of toRemove) {
      await promotion.removeProductPromotion(pid);
    }

    return promotion;
  } catch (error) {
    throw new Error('Failed to update promotion: ' + error.message);
  }
}


// Function to delete a promotion
async function deletePromotion(id) {
  try {
    const promotion = await Promotions.findByPk(id);
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    await promotion.destroy();
  } catch (error) {
    throw new Error('Failed to delete promotion: ' + error.message);
  }
}

// Function to apply a promotion to a product
async function applyPromotionToProduct(promoId, productId) {
  try {
    const product = await Products.findByPk(productId);
    const promotion = await Promotions.findByPk(promoId);

    if (!product || !promotion) {
      throw new Error('Product or Promotion not found');
    }

    await ProductPromotions.create({
      promo_id: promoId,
      product_id: productId,
    });
  } catch (error) {
    throw new Error('Failed to apply promotion to product: ' + error.message);
  }
}

// Function to remove a promotion from a product
async function removePromotionFromProduct(promoId, productId) {
  try {
    const product = await Products.findByPk(productId);
    const promotion = await Promotions.findByPk(promoId);

    if (!product || !promotion) {
      throw new Error('Product or Promotion not found');
    }

    await ProductPromotions.destroy({
      where: {
        promo_id: promoId,
        product_id: productId,
      },
    });
  } catch (error) {
    throw new Error('Failed to remove promotion from product: ' + error.message);
  }
}

module.exports = {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  applyPromotionToProduct,
  removePromotionFromProduct
};