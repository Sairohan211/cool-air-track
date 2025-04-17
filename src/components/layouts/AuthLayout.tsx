
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-acblue-100 to-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
