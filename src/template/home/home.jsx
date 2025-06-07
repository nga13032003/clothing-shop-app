import React from 'react';
import { Layout } from 'antd';
import './home.css';
import HeaderComponent from './Header';
import ChatBox from '../../components/chatbox';
import CustomFooter from './Footer';

const { Content } = Layout;

const App = ({ children }) => {
  return (
    <Layout className="layout">
      <HeaderComponent />

      <Content className="content">
        <div>{children}</div>
        <ChatBox />
      </Content>

      <CustomFooter />
    </Layout>
  );
};

export default App;
