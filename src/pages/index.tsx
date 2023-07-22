import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import Layout from '../components/Layout';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <h2>Oracle</h2>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
