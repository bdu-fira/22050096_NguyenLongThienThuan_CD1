import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import productReducer from './slices/productSlice';
import promotionReducer from './slices/promotionSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import contractReducer from './slices/contractSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import categoryReducer from './slices/categorySlice';
import employeeReducer from './slices/employeeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    promotion: promotionReducer,
    cart: cartReducer,
    order: orderReducer,
    contract: contractReducer,
    user: userReducer,
    role: roleReducer,
    category: categoryReducer,
    employee: employeeReducer,
  },
});

export default store;