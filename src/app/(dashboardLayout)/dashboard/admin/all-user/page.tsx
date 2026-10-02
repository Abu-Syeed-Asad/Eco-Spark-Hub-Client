"use client"

import BasicTanstackTable from '@/components/tanstackTable/BasicTanstackTable';
import { columns, type UserData } from '@/components/tanstackTable/tanstackTableData';
import { getDashboardAllUser } from '@/service/dashboard/allUser';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const AllUsr = () => {
    const { data, isLoading } = useQuery<UserData[]>({
    queryKey: ["dashboard-all-user"],
    queryFn: () => getDashboardAllUser<UserData[]>()
  });

  return (
    <div >
      <BasicTanstackTable
        data={data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No users found."
      />
    </div>
  );
};

export default AllUsr;