import React, { ReactNode } from 'react';
import { Link } from 'gatsby';
import { useAuth } from '../auth/AuthProvider';
import Login from '../components/Login';
interface LayoutProps {
  children: ReactNode;
}

// Define the functional component with TypeScript type annotations
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const authContext = useAuth();

  const user = authContext?.user ?? null;
  const logout = authContext?.logout ?? (() => {});

  const nav = [
    { name: 'Oracle', href: '/' },
    { name: 'Create Deck', href: '/create-deck' },
    { name: 'Decks', href: '/decks' },
  ];

  return (
    <div className="bg-gray-400 min-h-screen">
      <header className="width-wrapper">
        <h1 className="text-3xl font-bold underline">Oracle Thread</h1>
        <nav>
          <ul className="flex flex-row gap-6">
            {nav.map((navItem) => (
              <li key={navItem.name}>
                <Link to={navItem.href}>{navItem.name}</Link>
              </li>
            ))}
            {user && (
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>{user ? children : <Login />}</main>
      <footer className="width-wrapper py-8">
        <p>
          &copy; {new Date().getFullYear()} Oracle Thread. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
