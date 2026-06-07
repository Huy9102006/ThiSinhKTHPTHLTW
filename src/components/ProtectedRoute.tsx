import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;