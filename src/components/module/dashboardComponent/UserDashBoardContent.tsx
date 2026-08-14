import React from 'react';
import StatsCard from './StateCard';
import DashboardPichart from './DashboardPichart';
import DashboardBarChart from './DashboardBarchart';
const chartData = [
  { name: "Sleep", value: 8 },
  { name: "Study", value: 6 },
  { name: "Entertainment", value: 4 },
  { name: "Exercise", value: 2 },
  { name: "Other", value: 4 },
];
const UserDashBoardContent = () => {
  return (
    <div >
      <StatsCard />
      <div className='p-6 '>
        <h2 className='text-xl font-semibold mb-2 text-center'>
          Dashboard Pie chart
        </h2>
        <DashboardPichart data={chartData} />
        
      
      </div>
      <div className='p-6'>
          <h2 className='text-xl font-semibold mb-2 text-center'>
          Dashboard Bar chart
        </h2>
           <DashboardBarChart data={chartData} />
        </div>
    </div>
  );
};

export default UserDashBoardContent;