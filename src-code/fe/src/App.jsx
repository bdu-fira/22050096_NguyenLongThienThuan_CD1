import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AuthWrapper from './components/AuthWrapper';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import CustomerFormPage from './pages/customer/CustomerFormPage';
import CustomerInfoPage from './pages/customer/CustomerInfoPage';
import CustomerEditPage from './pages/customer/CustomerEditPage';
import ProductListPage from './pages/products/ProductListPage';
import PromotionListPage from './pages/promotions/PromotionListPage';
import CartPage from './pages/cart/CartPage';
import OrderSummaryPage from './pages/order/OrderSummaryPage';
import OrderHistoryPage from './pages/orders/OrderHistoryPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import EmployeeOrderListPage from './pages/employee/EmployeeOrderListPage';
import EmployeeOrderDetailPage from './pages/employee/EmployeeOrderDetailPage';
import ContractListPage from './pages/contracts/ContractListPage';
import ContractDetailPage from './pages/contracts/ContractDetailPage';
import CreateContractPage from './pages/contracts/CreateContractPage';
import UserListPage from './pages/admin/UserListPage';
import RoleManagerPage from './pages/admin/RoleManagerPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import PromotionManagerPage from './pages/admin/PromotionManagerPage';
import OrderManagerPage from './pages/admin/OrderManagerPage';
import AdminContractPage from './pages/admin/AdminContractPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import CustomerGuard from './components/CustomerGuard';
import CustomersListPage from './pages/employee/CustomersListPage';
import EmployeeForm from './components/EmployeeForm';
import EmployeeInfoPage from './pages/employee/EmployeeInfoPage';
import EmployeeEditPage from './pages/employee/EmployeeEditPage';
import EmployeeCreatePage from './pages/employee/EmployeeCreatePage';
import CategoryManagerPage from './pages/admin/CategoryManagerPage';
import CustomerTypesManager from './pages/admin/CustomerTypesManager';
import RoleUserManagerPage from './pages/admin/RoleUserManagerPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          

          <Route path="/" element={<MainLayout />}>
            {/* Không cần guard - Trang chính */}
            <Route index element={<AuthWrapper><CustomerInfoPage /></AuthWrapper>} />
            
            <Route path="change-password" element={<ChangePasswordPage />} />
            {/* Bắt đầu dùng CustomerGuard */}
            <Route path="products" element={
              <ProductListPage />
            } />
            <Route path="promotions" element={
              <CustomerGuard><PromotionListPage /></CustomerGuard>
            } />
            <Route path="cart" element={
              <CartPage />
            } />
            <Route path="order-summary" element={
            <CustomerGuard><OrderSummaryPage /></CustomerGuard>
            } />
            <Route path="order-history" element={
              <CustomerGuard><OrderHistoryPage /></CustomerGuard>
            } />
            <Route path="order-detail/:id" element={
              <CustomerGuard>  <OrderDetailPage /></CustomerGuard>
            
            } />
            <Route path="contracts" element={
              <CustomerGuard><ContractListPage /></CustomerGuard>
            } />
            <Route path="contract-detail/:id" element={
              <CustomerGuard><ContractDetailPage /></CustomerGuard>
            } />
            <Route path="create-contract" element={
              <CustomerGuard><CreateContractPage /></CustomerGuard>
            } />

            {/* Không dùng guard - Dành cho thao tác hồ sơ khách hàng */}
            <Route path="customer-form" element={
              <CustomerFormPage />
              
              } />
            <Route path="customer-info" element={<CustomerGuard><CustomerInfoPage /></CustomerGuard>} />
            <Route path="customer-edit" element={<CustomerGuard><CustomerEditPage /></CustomerGuard>} />
          </Route>

          <Route path="/employee" element={<AuthWrapper><MainLayout /></AuthWrapper>}>
            <Route path="employee-form" element={<EmployeeCreatePage />} />
            <Route path="employee-info" element={<EmployeeInfoPage />} />
            <Route path="employee-edit" element={<EmployeeEditPage />} />
            <Route path="customers" element={<CustomersListPage />} />
            <Route path="orders" element={<EmployeeOrderListPage />} />
            <Route path="order-detail/:id" element={<EmployeeOrderDetailPage />} />
            <Route path="products" element={<ProductManagerPage />} />
            <Route path="promotions" element={<PromotionManagerPage />} />
            <Route path="contracts" element={<AdminContractPage />} />
            <Route path="Category" element={<CategoryManagerPage />} />
            <Route path="CustomerTypes" element={<CustomerTypesManager />} />
            <Route path="contract-detail/:id" element={
             <ContractDetailPage />
            } />
          </Route>

          <Route path="/admin" element={<AuthWrapper><AdminLayout /></AuthWrapper>}>
            <Route path="users" element={<UserListPage />} />
            <Route path="roles" element={<RoleManagerPage />} />
            <Route path="role-users" element={<RoleUserManagerPage />} />
            <Route path="Category" element={<CategoryManagerPage />} />
            <Route path="products" element={<ProductManagerPage />} />
            <Route path="promotions" element={<PromotionManagerPage />} />
            <Route path="orders" element={<EmployeeOrderListPage />} />
            <Route path="order-detail/:id" element={<EmployeeOrderDetailPage />} />
            <Route path="contracts" element={<AdminContractPage />} />
            <Route path="contract-detail/:id" element={<ContractDetailPage />} />
            <Route path="users" element={<UserListPage />} />
             <Route path="CustomerTypes" element={<CustomerTypesManager />} />
            <Route path="customers" element={<CustomersListPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;