import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Mỗi item: { product_id, quantity, product }
  selectedPromotions: [], // ✅ Cho phép chọn nhiều khuyến mãi
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product_id === product.product_id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product_id: product.product_id,
          quantity: 1,
          product,
        });
      }
    },

    removeFromCart: (state, action) => {
      const product_id = action.payload;
      state.items = state.items.filter(item => item.product_id !== product_id);
    },

    updateQuantity: (state, action) => {
      const { product_id, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === product_id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.selectedPromotions = [];
    },

    applyPromotion: (state, action) => {
      const promo = action.payload;
      const exists = state.selectedPromotions.find(p => p.promo_id === promo.promo_id);
      if (!exists) {
        state.selectedPromotions.push(promo);
      }
    },

    removePromotion: (state, action) => {
      const promo_id = action.payload;
      state.selectedPromotions = state.selectedPromotions.filter(p => p.promo_id !== promo_id);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyPromotion,
  removePromotion,
} = cartSlice.actions;

export default cartSlice.reducer;
