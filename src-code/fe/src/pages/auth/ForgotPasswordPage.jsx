import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values);
      message.success(t('Mật khẩu mới đã được gửi tới email của bạn'));
      navigate('/login');
    } catch (err) {
      message.error(t('auth.forgotPassword.error'));
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
        <h2 className="text-3xl font-bold text-center mb-6">
          Quên Mật Khẩu
        </h2>

        <Form
          name="forgot_password_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: t('không được để trống ') }]}
          >
            <Input
              prefix={<MailOutlined className="text-white/80" />}
              placeholder={t('auth.email')}
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
              gửi mật khẩu về email
            </Button>
          </Form.Item>

          <div className="text-center text-sm mt-2">
            <Link to="/login" className="text-emerald-400 hover:underline">
              {'Quay về đăng nhập'}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
