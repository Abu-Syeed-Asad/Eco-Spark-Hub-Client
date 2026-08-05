import React from 'react';

const DashBoardLayout  = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex '>
      <div className='min-w-70'>
        this slote use for  navigatin menue
      </div>
      <div>
        {children}
      </div>

      
    </div>
  );
};

export default DashBoardLayout ;