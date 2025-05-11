import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../redux/slices/authSlice';
import { Spin } from 'antd';

const AuthWrapper = ({ children }) => {
  const { token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate('/products');
      return;
    }
  }, [token, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Render children only if the token exists and is valid
  return <>{children}</>;
};

export default AuthWrapper;