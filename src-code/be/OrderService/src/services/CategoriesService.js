const db = require('../models/index');
const {Categories,Products} = db;
const CategoriesService = {
  /**
   * Creates a new category.
   *
   * @param {object} data - The category data.
   * @returns {Promise<Categories>} - The created category.
   */
  createCategory: async (data) => {
    try {
      const category = await Categories.create(data);
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Retrieves all categories.
   *
   * @param {object} options - Query options.
   * @returns {Promise<Array<Categories>>} - A list of categories.
   */
  getAllCategories: async (options = {}) => {
    try {
      const categories = await Categories.findAll({include:[{model:Products,as:"products"}]});
      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw error;
    }
  },

  /**
   * Retrieves a category by ID.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Categories|null>} - The category, or null if not found.
   */
  getCategoryById: async (id) => {
    try {
      const category = await Categories.findByPk(id);
      return category;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw error;
    }
  },

  /**
   * Updates an existing category.
   *
   * @param {number} id - The category ID.
   * @param {object} data - The updated category data.
   * @returns {Promise<Array<number>>} - An array containing the number of affected rows.
   */
  updateCategory: async (id, data) => {
    try {
      const [updated] = await Categories.update(data, {
        where: { category_id: id },
      });
      return [updated];
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Deletes a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<number>} - The number of deleted rows.
   */
  deleteCategory: async (id) => {
    try {
      const deleted = await Categories.destroy({
        where: { category_id: id },
      });
      return deleted;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

module.exports = {
  createCategory: CategoriesService.createCategory,
  getAllCategories: CategoriesService.getAllCategories,
  getCategoryById: CategoriesService.getCategoryById,
  updateCategory: CategoriesService.updateCategory,
  deleteCategory: CategoriesService.deleteCategory,
};
