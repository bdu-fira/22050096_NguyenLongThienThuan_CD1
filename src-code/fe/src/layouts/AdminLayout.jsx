import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const userName = auth.user?.full_name || auth.user?.email || 'Admin';

   const handleLogout = () => {
      dispatch(logout());
      sessionStorage.removeItem('auth');
      navigate('/login');
    };
    const handleChangePass = () => {
      navigate('change-password');
    };
  
    const userMenu = (
      <Menu>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
        <Menu.Item key="changePassword" icon={<LogoutOutlined />} onClick={handleChangePass}>
          Đổi mật khẩu 
        </Menu.Item>
      </Menu>
    );

  return (
    <Layout className="min-h-screen font-[Quicksand] text-white bg-cover bg-center" style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}>
      <Header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg px-6 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-bold text-white tracking-wider">Admin Panel</div>
        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-all">
            <Avatar icon={<UserOutlined />} size="small" />
            <span className='text-white'>{userName}</span>
          </div>
        </Dropdown>
      </Header>

      <Layout>
        <Sider width={200} className="!bg-white/20 backdrop-blur-md border-r border-white/30 shadow-lg">
          <Menu mode="inline" defaultSelectedKeys={['dashboard']} defaultOpenKeys={['dashboard']} className="bg-transparent text-white" style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item key="dashboard">
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>

            <SubMenu key="admin-users" icon={<UserOutlined />} title="Người dùng">
              <Menu.Item key="users">
                <Link to="/admin/users">Danh sách</Link>
              </Menu.Item>
              <Menu.Item key="roles">
                <Link to="/admin/roles">Vai trò</Link>
              </Menu.Item>
              <Menu.Item key="role-users">
                <Link to="/admin/role-users">Gán vai trò</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="admin-customer" icon={<LaptopOutlined />} title="Khách hàng">
              <Menu.Item key="admin-customerlv">
                <Link to="/admin/CustomerTypes">Cấp độ khách hàng</Link>
              </Menu.Item>
              <Menu.Item key="admin-customer">
                <Link to="/admin/customers">Danh sách khách</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="admin-products" icon={<LaptopOutlined />} title="Sản phẩm">
              <Menu.Item key="admin-category">
                <Link to="/admin/Category">Danh mục</Link>
              </Menu.Item>
              <Menu.Item key="admin-products">
                <Link to="/admin/products">Sản phẩm</Link>
              </Menu.Item>
              <Menu.Item key="admin-promotions">
                <Link to="/admin/promotions">Khuyến mãi</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="admin-orders" icon={<NotificationOutlined />} title="Đơn hàng">
              <Menu.Item key="admin-orders">
                <Link to="/admin/orders">Danh sách đơn</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="admin-contracts" icon={<NotificationOutlined />} title="Hợp đồng">
              <Menu.Item key="admin-contracts">
                <Link to="/admin/contracts">Danh sách hợp đồng</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>

        <Layout className="px-6 pb-6">
          <Content className="bg-transparent backdrop-blur-lg p-6 mt-4 rounded-xl shadow-xl border border-white/20 min-h-[300px]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Footer className="text-center text-white/80 py-6 text-sm bg-transparent backdrop-blur-sm border-t border-white/20">
        Admin Panel ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
