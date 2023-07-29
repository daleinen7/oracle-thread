import React from 'react';
import Login from '../components/Login';
import Layout from '../components/Layout';

const DecksPage: React.FC = () => {
  return (
    <Layout login>
      <h2>Login</h2>
      <Login />
    </Layout>
  );
};

export default DecksPage;
