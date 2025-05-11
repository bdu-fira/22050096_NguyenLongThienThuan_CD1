import React, { useEffect, useState } from 'react';
import { Layout, Menu, Badge, Switch, Dropdown, Avatar } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SubMenu from 'antd/es/menu/SubMenu';
import { logout } from '../redux/slices/authSlice';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const auth = useSelector((state) => state.auth);
  const roles = auth.user?.roles || [];
  const userName = auth.user?.full_name || auth.user?.email || 'Tài khoản';
  const isLoggedIn = Boolean(auth.user);

  const isEmployee = roles.includes('Employee');
  const isCustomer = roles.includes('Customer');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isEmployeeView, setIsEmployeeView] = useState(location.pathname.startsWith('/employee'));

  useEffect(() => {
    // If neither customer nor employee, you could redirect:
    // if (!isCustomer && !isEmployee) navigate('/products');
  }, [isCustomer, isEmployee, navigate]);

  const handleToggleView = (checked) => {
    setIsEmployeeView(checked);
    navigate(checked ? '/employee/employee-info' : '/customer-info');
  };

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
    <Layout
      className="min-h-screen font-[Quicksand] text-white bg-cover bg-center"
      style={{ backgroundImage: `url('https://raw.githubusercontent.com/CiurescuP/LogIn-Form/main/bg.jpg')` }}
    >
      {/* Header */}
      <Header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl md:text-2xl font-bold text-white tracking-wider">
            YourBrand
          </Link>
          {isEmployee && (
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm">Chế độ:</span>
              <Switch
                checked={isEmployeeView}
                onChange={handleToggleView}
                checkedChildren="Nhân viên"
                unCheckedChildren="Khách hàng"
                className="bg-gray-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Badge count={cartCount} offset={[0, 0]} size="default" showZero>
            <ShoppingCartOutlined
              className="text-2xl text-white hover:text-emerald-400 cursor-pointer transition-all"
              onClick={() => navigate('/cart')}
            />
          </Badge>

          {isLoggedIn ? (
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-all">
                <Avatar icon={<UserOutlined />} size="small" />
                <span className="text-white">{userName}</span>
              </div>
            </Dropdown>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-emerald-400 transition-all"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </Header>

      <Layout>
        <Sider width={200} className="!bg-white/20 backdrop-blur-md border-r border-white/30 shadow-lg">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            className="bg-transparent text-white"
            style={{ height: '100%', borderRight: 0 }}
          >
            {isEmployee && isEmployeeView ? (
              <>
                <SubMenu key="admin4" icon={<LaptopOutlined />} title="Khách hàng">
                  <Menu.Item key="admin-customerlv">
                    <Link to="/employee/CustomerTypes">Cấp độ khách hàng</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-customer">
                    <Link to="/employee/customers">Khách hàng</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="admin2" icon={<LaptopOutlined />} title="Quản lý">
                  <Menu.Item key="admin-category">
                    <Link to="/employee/Category">Danh mục</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-products">
                    <Link to="/employee/products">Sản phẩm</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-promotions">
                    <Link to="/employee/promotions">Khuyến mãi</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-contracts">
                    <Link to="/employee/contracts">Hợp đồng</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="admin3" icon={<NotificationOutlined />} title="Đơn hàng">
                  <Menu.Item key="admin-orders-quote">
                    <Link to="/employee/orders?status=chờ báo giá">Chờ báo giá</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-orders-payment">
                    <Link to="/employee/orders?status=chờ thanh toán">Chờ thanh toán</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-orders-packing">
                    <Link to="/employee/orders?status=chờ soạn đơn">Chờ soạn đơn</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-orders-pickup">
                    <Link to="/employee/orders?status=chờ đi đơn">Chờ đi đơn</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-orders-shipping">
                    <Link to="/employee/orders?status=chờ giao hàng">Chờ giao hàng</Link>
                  </Menu.Item>
                  <Menu.Item key="admin-orders-delivered">
                    <Link to="/employee/orders?status=đã giao">Đã giao</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="employee-profile" icon={<UserOutlined />} title="Hồ sơ nhân viên">
                  <Menu.Item key="emp-info">
                    <Link to="/employee/employee-info">Thông tin</Link>
                  </Menu.Item>
                </SubMenu>
              </>
            ) : (
              <>
                <SubMenu key="sub1" icon={<UserOutlined />} title="Tài khoản">
                  <Menu.Item key="1">
                    <Link to="/customer-info">Thông tin</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/order-history">Lịch sử đơn hàng</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<LaptopOutlined />} title="Sản phẩm">
                  <Menu.Item key="5">
                    <Link to="/products">Danh sách</Link>
                  </Menu.Item>
                  <Menu.Item key="7">
                    <Link to="/cart">Giỏ hàng</Link>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <Link to="/promotions">Khuyến mãi</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<NotificationOutlined />} title="Đơn hàng">
                  <Menu.Item key="9">
                    <Link to="/order-history">Xem đơn</Link>
                  </Menu.Item>
                </SubMenu>
              </>
            )}
          </Menu>
        </Sider>

        <Layout className="px-6 pb-6">
          <Content className="bg-transparent backdrop-blur-lg p-6 mt-4 rounded-xl shadow-xl border border-white/20 min-h-[300px]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Footer className="text-center text-white/80 py-6 text-sm bg-transparent backdrop-blur-sm border-t border-white/20">
        Your Company ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainLayout;
