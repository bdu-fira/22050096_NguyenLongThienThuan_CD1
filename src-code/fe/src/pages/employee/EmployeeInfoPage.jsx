import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeByUser } from '../../redux/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';

const EmployeeInfoPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, loading } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.iduser) {
      dispatch(fetchEmployeeByUser(user.iduser));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && !employee) {
      navigate('/employee/employee-form');
    }
  }, [loading, employee, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-[Quicksand] px-4"
      style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}
    >
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Thông tin nhân viên</h2>

        {employee && (
          <div className="space-y-4 text-sm md:text-base">
            <div>
              <label className="block font-semibold text-white/80">Tên nhân viên</label>
              <input
                value={employee.staff_name}
                readOnly
                className="w-full bg-black/30 text-white border border-white/30 px-4 py-2 mt-1 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-white/80">Email</label>
              <input
                value={employee.email}
                readOnly
                className="w-full bg-black/30 text-white border border-white/30 px-4 py-2 mt-1 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-white/80">Số điện thoại</label>
              <input
                value={employee.phone_number}
                readOnly
                className="w-full bg-black/30 text-white border border-white/30 px-4 py-2 mt-1 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-white/80">Địa chỉ</label>
              <input
                value={employee.address}
                readOnly
                className="w-full bg-black/30 text-white border border-white/30 px-4 py-2 mt-1 rounded"
              />
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/employee/employee-edit')}
                className="w-full border border-white py-2 rounded hover:bg-blue-500 hover:text-white transition font-semibold"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeInfoPage;
