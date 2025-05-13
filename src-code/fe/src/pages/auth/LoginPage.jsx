import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { login } from '../../redux/slices/authSlice';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading, error, user, token } = useSelector((state) => state.auth);

  // Redirect after login
  if (token && user) {
    const isAdmin = user.roles.includes('Admin');
    navigate(isAdmin ? '/admin' : '/');
  }

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await dispatch(
        login({ email: values.email, password: values.password })
      );
      sessionStorage.setItem('auth', JSON.stringify(response.payload));
      
    } catch (err) {
      message.error(err.message || 'Đã xảy ra lỗi khi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')",
      }}
    >
      <div className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-2xl rounded-xl p-8 w-full max-w-md text-white font-[Quicksand]">
        <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập</h2>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-white/80" />}
              placeholder="Email"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 !border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-white/80" />}
              placeholder="Mật khẩu"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 !border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          {/* Forgot Password Link */}
          <Form.Item>
            <div className="text-right">
              <Link to="/forgot-password" className="text-emerald-400 hover:underline text-sm">
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              className="w-full bg-transparent border border-white text-white py-2 rounded hover:bg-emerald-500 hover:text-white transition duration-300"
              loading={loading || authLoading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center text-sm mt-2">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline">
              Đăng ký ngay
            </Link>
          </div>

          {error && <div className="text-red-400 text-sm mt-3">Đăng nhập thất bại</div>}
        </Form>
      </div>
    </div>
  );
}