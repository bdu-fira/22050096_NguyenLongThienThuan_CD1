import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { changePassword } from '../../redux/slices/authSlice';

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          token,
        })
      ).unwrap();
      message.success('Đổi mật khẩu thành công!');
      navigate('/login');
    } catch (err) {
      message.error(err.message || 'Đổi mật khẩu thất bại!');
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
        <h2 className="text-3xl font-bold text-center mb-6">Đổi mật khẩu</h2>

        <Form
          name="change_password_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-white/80" />}
              placeholder="Mật khẩu cũ"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 !border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password
              prefix={<KeyOutlined className="text-white/80" />}
              placeholder="Mật khẩu mới"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 !border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined className="text-white/80" />}
              placeholder="Xác nhận mật khẩu mới"
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 !border px-4 py-2 rounded focus:!bg-black/30 hover:!bg-black/30"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              className="w-full bg-transparent border border-white text-white py-2 rounded hover:bg-emerald-500 hover:text-white transition duration-300"
              loading={loading}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>

          <div className="text-center text-sm mt-2">
            <Link to="/login" className="text-emerald-400 hover:underline">
              Quay về đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
