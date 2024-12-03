import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
  const loaderClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white' 
    : 'flex items-center justify-center';

  return (
    <div className={loaderClasses}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-municipal-500"></div>
    </div>
  );
};

export default Loader;
