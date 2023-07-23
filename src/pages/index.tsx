import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import Login from '../components/Login';
import { useAuth } from '../auth/AuthProvider';

const IndexPage: React.FC<PageProps> = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h2>Oracle</h2>
      {user && (
        <p>
          You are logged in as <strong>{user.email}</strong>.
        </p>
      )}
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
