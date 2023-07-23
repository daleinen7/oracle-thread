import './src/styles/global.css';

import React from 'react';
import { AuthProvider } from './src/auth/AuthProvider';

export const wrapRootElement = ({ element }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
