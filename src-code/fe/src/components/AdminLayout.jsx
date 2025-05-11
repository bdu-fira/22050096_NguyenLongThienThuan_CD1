import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="site-layout-background" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0, background: 'transparent', color: 'white' }}
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="User Management">
            <Menu.Item key="1"><Link to="/admin/users">Users</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/admin/roles">Roles</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<LaptopOutlined />} title="Product Management">
            <Menu.Item key="5"><Link to="/admin/products">Products</Link></Menu.Item>
            <Menu.Item key="6"><Link to="/admin/promotions">Promotions</Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<NotificationOutlined />} title="Order & Contract">
              <Menu.Item key="9"><Link to="/admin/orders">Orders</Link></Menu.Item>
              <Menu.Item key="10"><Link to="/admin/contracts">Contracts</Link></Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
         }}>
          Admin Panel
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial',
         background: 'rgba(255, 255, 255, 0.05)',
         backdropFilter: 'blur(10px)',
         color: 'white'
        }}>
          <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;