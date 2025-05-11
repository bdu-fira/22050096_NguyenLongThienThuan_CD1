// components/guards/CustomerGuard.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const CustomerGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const customer = useSelector((state) => state.customer.customer);

  const isCustomer = user?.roles?.includes('Customer');

  if(!isCustomer){
   return  <Navigate to="/login" replace />
  }
 else if (isCustomer && !customer) {
    return <Navigate to="/customer-form" replace />;
  } 

  return children;
};

export default CustomerGuard;
