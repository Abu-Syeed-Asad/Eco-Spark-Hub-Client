"use client"
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";


type pieChartData = {
  name: string;
  value: number;
}
interface CustomPichartProps {
  data: pieChartData[];
}

const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A855F7",
  "#EC4899",

]


const DashboardPichart = ({data}:CustomPichartProps) => {
  return (
    <div className='w-full h-[360px]' >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data }
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy={"50%"}
            outerRadius={120}
            label={({ name, percent = 0 }) =>
            `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {
              data.map((_, index) => (
                <Cell key={`cell-${index}`}
                fill={colors[index%colors.length]}
                />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend/>
        </PieChart> 

      </ResponsiveContainer>
     
    </div>
  );
};

export default DashboardPichart;