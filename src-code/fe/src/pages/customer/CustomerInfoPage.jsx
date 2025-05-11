import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerByUser } from '../../redux/slices/customerSlice';
import { Link } from 'react-router-dom';

const CustomerInfoPage = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer.customer);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!customer && user?.iduser) {
      dispatch(fetchCustomerByUser(user.iduser));
    }
  }, [dispatch, customer, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4 font-[Quicksand]">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8 text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Thông tin khách hàng</h2>

        {!customer ? (
          <div className="text-center">
            <p className="text-lg mb-4">Không tìm thấy hồ sơ khách hàng.</p>
            <Link to="/customer-form">
              <button className="w-full bg-transparent border border-black py-2 rounded-lg hover:bg-emerald-500 hover:text-white transition duration-300 font-semibold">
                Tạo hồ sơ khách hàng
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 text-sm md:text-base">
            <div>
              <label className="block font-semibold text-gray-700">Tên khách hàng</label>
              <input
                value={customer.customer_name}
                readOnly
                className="w-full bg-white border border-gray-300 px-4 py-2 mt-1 rounded shadow-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Người liên hệ</label>
              <input
                value={customer.contact_person}
                readOnly
                className="w-full bg-white border border-gray-300 px-4 py-2 mt-1 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Email</label>
              <input
                value={customer.primary_email}
                readOnly
                className="w-full bg-white border border-gray-300 px-4 py-2 mt-1 rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Địa chỉ</label>
              <input
                value={customer.address}
                readOnly
                className="w-full bg-white border border-gray-300 px-4 py-2 mt-1 rounded shadow-sm"
              />
            </div>
            {customer.tax_code && (
              <div>
                <label className="block font-semibold text-gray-700">Mã số thuế</label>
                <input
                  value={customer.tax_code}
                  readOnly
                  className="w-full bg-white border border-gray-300 px-4 py-2 mt-1 rounded shadow-sm"
                />
              </div>
            )}
            <div className="text-center mt-6">
              <Link to="/customer-edit">
                <button className="w-full bg-transparent border border-black py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 font-semibold">
                  Chỉnh sửa thông tin
                </button>
              </Link>
              <Link to="/change-password">
                <button className="w-full bg-transparent border border-black py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 font-semibold">
                 đổi mật khẩu 
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfoPage;
