import React, { ReactNode } from "react";

// Define types for props, if any
interface LayoutProps {
  children: ReactNode; // 'children' prop will hold the content passed to the component
}

// Define the functional component with TypeScript type annotations
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold underline">My Gatsby App</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>
          &copy; {new Date().getFullYear()} Oracle Thread. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
