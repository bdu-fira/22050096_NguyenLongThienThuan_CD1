import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../../redux/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import { Button, Result } from 'antd';

const EmployeeCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { employee } = useSelector((state) => state.employee);

  const handleCreate = async (data) => {
    try {
      await dispatch(createEmployee({ iduser: user.iduser, ...data })).unwrap();
      navigate('/employee/employee-info');
    } catch (error) {
      console.error('Tạo nhân viên thất bại:', error);
    }
  };

  if (employee) {
    return (
      <Result
        status="success"
        title="Đã có hồ sơ nhân viên"
        extra={<Button type="" onClick={() => navigate('/employee/employee-info')}>Xem hồ sơ</Button>}
      />
    );
  }

  return <EmployeeForm onSubmit={handleCreate} />;
};

export default EmployeeCreatePage;
