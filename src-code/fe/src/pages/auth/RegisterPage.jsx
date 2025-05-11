import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { register } from '../../redux/slices/authSlice';

const RegisterPage = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    try {
      await dispatch(register({
        email: values.email,
        password: values.password,
        address: values.address,
        phone_number: values.phoneNumber,
      })).unwrap();
      message.success('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.log(err);
      
      message.error(err.message || 'Đã xảy ra lỗi khi đăng ký.');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center font-[Quicksand]"
      style={{
        backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')`
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Đăng ký</h2>
        <Form
          name="register_form"
          initialValues={formValues}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input
              placeholder="Địa chỉ"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input
              placeholder="Số điện thoại"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-white/20 text-white hover:bg-emerald-500 border border-white/30 font-semibold tracking-wide"
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center text-white">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-300 underline hover:text-blue-400">
              Đăng nhập
            </Link>
          </div>

          {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
