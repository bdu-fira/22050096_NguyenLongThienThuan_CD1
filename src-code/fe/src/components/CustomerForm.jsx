import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCustomer, updateCustomer } from '../redux/slices/customerSlice';

const { Option } = Select;
const { Title } = Typography;

const CustomerFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = useSelector((state) => state.customer);
  const isEdit = location.pathname.includes('edit');

  const validationSchema = Yup.object().shape({
    customer_name: Yup.string().required('Tên khách hàng là bắt buộc'),
    contact_person: Yup.string().required('Người liên hệ là bắt buộc'),
    primary_email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    tax_code: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      customer_name: '',
      contact_person: '',
      primary_email: '',
      address: '',
      tax_code: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const action = isEdit
        ? updateCustomer({ id: customer.customer_id, data: values })
        : createCustomer(values);
      dispatch(action)
        .unwrap()
        .then(() => navigate('/customer-info'));
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isEdit && customer) {
      formik.setValues({
        customer_name: customer.customer_name || '',
        contact_person: customer.contact_person || '',
        primary_email: customer.primary_email || '',
        address: customer.address || '',
        tax_code: customer.tax_code || '',
        customer_type_id: customer.customer_type_id || null,
      });
    }
  }, [customer, isEdit]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-[Quicksand] px-4"
      style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}
    >
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 text-white">
        <Title level={2} className="text-center text-white mb-6">
          {isEdit ? 'Chỉnh sửa' : 'Tạo'} hồ sơ khách hàng
        </Title>

        <Form layout="vertical" onFinish={formik.handleSubmit}>
          <Form.Item
            label="Tên khách hàng"
            validateStatus={formik.errors.customer_name && formik.touched.customer_name ? 'error' : ''}
            help={formik.errors.customer_name && formik.touched.customer_name ? formik.errors.customer_name : ''}
          >
            <Input
              name="customer_name"
              value={formik.values.customer_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Tên khách hàng"
            />
          </Form.Item>

          <Form.Item
            label="Người liên hệ"
            validateStatus={formik.errors.contact_person && formik.touched.contact_person ? 'error' : ''}
            help={formik.errors.contact_person && formik.touched.contact_person ? formik.errors.contact_person : ''}
          >
            <Input
              name="contact_person"
              value={formik.values.contact_person}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Người liên hệ"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={formik.errors.primary_email && formik.touched.primary_email ? 'error' : ''}
            help={formik.errors.primary_email && formik.touched.primary_email ? formik.errors.primary_email : ''}
          >
            <Input
              name="primary_email"
              value={formik.values.primary_email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            validateStatus={formik.errors.address && formik.touched.address ? 'error' : ''}
            help={formik.errors.address && formik.touched.address ? formik.errors.address : ''}
          >
            <Input
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Địa chỉ"
            />
          </Form.Item>

          <Form.Item label="Mã số thuế">
            <Input
              name="tax_code"
              value={formik.values.tax_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Mã số thuế (nếu có)"
            />
          </Form.Item>

        
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full bg-white/20 text-white hover:bg-emerald-500 border border-white/30 font-semibold tracking-wide"
            >
              {isEdit ? 'Cập nhật' : 'Tạo'} khách hàng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CustomerFormPage;
