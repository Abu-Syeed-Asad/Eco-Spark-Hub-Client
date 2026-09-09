"use client";

import BasicTanstackTable from '@/components/tanstackTable/BasicTanstackTable';
import {
  allPayment,
  type PaymentListResponse,
  type PaymentRecord,
} from '@/service/auth/auth.client';
import { useQuery } from '@tanstack/react-query';

const formatDateTime = (value: string | null) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const paymentColumns = [
  {
    id: 'username',
    header: 'Username',
    accessorFn: (row: PaymentRecord) => row.user?.name ?? '-',
  },
  {
    id: 'userEmail',
    header: 'User Email',
    accessorFn: (row: PaymentRecord) => row.user?.email ?? '-',
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: { row: { original: PaymentRecord } }) =>
      `৳${Number(row.original.amount || 0).toLocaleString()}`,
  },
  {
    accessorKey: 'transactionId',
    header: 'Transaction ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: PaymentRecord } }) => {
      const status = row.original.status || 'Unknown';
      const normalizedStatus = String(status).toLowerCase();
      const tone =
        normalizedStatus === 'paid' || normalizedStatus === 'succeeded' || normalizedStatus === 'completed'
          ? 'bg-green-100 text-green-700'
          : normalizedStatus === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700';

      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }: { row: { original: PaymentRecord } }) =>
      formatDateTime(row.original.createdAt),
  },
  {
    accessorKey: 'postId',
    header: 'Post ID',
  },


  
];

const AllPaymentPage = () => {
  const { data, isLoading } = useQuery<PaymentListResponse>({
    queryKey: ['dashboard-all-payment'],
    queryFn: allPayment,
  });

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Payment Page</h1>
      </div>

      <BasicTanstackTable
        data={data?.data ?? []}
        columns={paymentColumns}
        isLoading={isLoading}
        emptyMessage="No payment records found."
        showRoleFilter={false}
      />
    </div>
  );
};

export default AllPaymentPage;