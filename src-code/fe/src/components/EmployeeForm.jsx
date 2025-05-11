import React, { useEffect } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createEmployee, updateEmployee } from '../redux/slices/employeeSlice';

const { Title } = Typography;

const EmployeeFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { employee } = useSelector((state) => state.employee);
  const isEdit = location.pathname.includes('edit');

  const validationSchema = Yup.object().shape({
    staff_name: Yup.string().required('Tên nhân viên là bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    phone_number: Yup.string().required('Số điện thoại là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
  });

  const formik = useFormik({
    initialValues: {
      staff_name: '',
      email: '',
      phone_number: '',
      address: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const action = isEdit
          ? updateEmployee({ id: employee.staff_id, data: values })
          : createEmployee({ iduser: user.iduser, ...values });
        
        await dispatch(action).unwrap();
        navigate('/employee/employee-info');
      } catch (err) {
        console.error('Submit error', err);
      }
    }
  });

  useEffect(() => {
    if (isEdit && employee) {
      formik.setValues({
        staff_name: employee.staff_name || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        address: employee.address || '',
      });
    }
  }, [employee, isEdit]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-[Quicksand] px-4"
      style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}
    >
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 text-white">
        <Title level={2} className="text-center text-white mb-6">
          {isEdit ? 'Chỉnh sửa' : 'Tạo'} hồ sơ nhân viên
        </Title>

        <Form layout="vertical" onFinish={formik.handleSubmit}>
          <Form.Item
            label="Tên nhân viên"
            validateStatus={formik.errors.staff_name && formik.touched.staff_name ? 'error' : ''}
            help={formik.errors.staff_name && formik.touched.staff_name ? formik.errors.staff_name : ''}
          >
            <Input
              name="staff_name"
              value={formik.values.staff_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Tên nhân viên"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
            help={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
          >
            <Input
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            validateStatus={formik.errors.phone_number && formik.touched.phone_number ? 'error' : ''}
            help={formik.errors.phone_number && formik.touched.phone_number ? formik.errors.phone_number : ''}
          >
            <Input
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!bg-black/30 !text-white !placeholder-white/70 !border-white/30 border px-4 py-2 rounded"
              placeholder="Số điện thoại"
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

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              className="w-full bg-white/20 text-white hover:bg-emerald-500 border border-white/30 font-semibold tracking-wide"
            >
              {isEdit ? 'Cập nhật' : 'Tạo'} nhân viên
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeFormPage;
