import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByUser, updateEmployee } from '../../redux/slices/employeeSlice'; // ✅ sửa lại slice đúng
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import { message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const EmployeeEditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.iduser) {
      dispatch(fetchEmployeeByUser(user.iduser));
    }
  }, [user, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateEmployee({ id: employee.staff_id, data: formData })).unwrap();
      message.success('Cập nhật thành công');
      navigate('/employee/employee-info');
    } catch (error) {
      console.error('Update failed:', error);
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employee/employee-info')} className="mb-4">
        Quay lại
      </Button>
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-8 border border-white/20 text-white">
        {employee && <EmployeeForm initialValues={employee} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default EmployeeEditPage;
