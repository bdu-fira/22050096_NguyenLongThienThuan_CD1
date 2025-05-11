// components/guards/EmployeeGuard.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const EmployeeGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const isEmployee = user?.roles?.includes('Employee');

  if (!isEmployee) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmployeeGuard;
