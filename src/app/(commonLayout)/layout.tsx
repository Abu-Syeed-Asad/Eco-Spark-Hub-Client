import React from 'react';

const HomeLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      home route
      {children}
    </div>
  );
};

export default HomeLayout;