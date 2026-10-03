"use client";

import BasicTanstackTable from "@/components/tanstackTable/BasicTanstackTable";
import { MyPayment, type PaymentListResponse, type PaymentRecord } from "@/service/auth/auth.client";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ReceiptText } from "lucide-react";

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const paymentColumns = [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }: { row: { original: PaymentRecord } }) => (
      <span className="block max-w-40 truncate font-mono text-xs" title={row.original.id}>
        {row.original.id || "-"}
      </span>
    ),
  },
  {
    id: "post",
    header: "Post",
    accessorFn: (row: PaymentRecord) => row.post?.title ?? row.postId ?? "-",
    cell: ({ row }: { row: { original: PaymentRecord } }) => (
      <span
        className="block max-w-56 truncate font-medium text-gray-900"
        title={row.original.post?.title ?? row.original.postId}
      >
        {row.original.post?.title ?? row.original.postId ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: { original: PaymentRecord } }) => (
      <span className="font-semibold text-gray-900">{formatAmount(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction",
    cell: ({ row }: { row: { original: PaymentRecord } }) => (
      <span
        className="block max-w-40 truncate font-mono text-xs"
        title={row.original.transactionId}
      >
        {row.original.transactionId || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: PaymentRecord } }) => {
      const status = row.original.status || "Unknown";
      const normalizedStatus = status.toLowerCase();
      const tone =
        normalizedStatus === "paid" ||
        normalizedStatus === "succeeded" ||
        normalizedStatus === "completed"
          ? "border-green-200 bg-green-50 text-green-700"
          : normalizedStatus === "pending"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : normalizedStatus === "failed" ||
                normalizedStatus === "canceled" ||
                normalizedStatus === "cancelled"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-gray-600";

      return (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }: { row: { original: PaymentRecord } }) =>
      formatDateTime(row.original.createdAt),
  },
];

const PaymentPage = () => {
  const { data, isLoading, isError } = useQuery<PaymentListResponse>({
    queryKey: ["dashboard-my-payment"],
    queryFn: MyPayment,
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CreditCard className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">My payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              View your transactions, post purchases, and payment statuses.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full bg-gray-50 px-3 py-2 text-sm text-gray-600 sm:self-center">
          <ReceiptText className="size-4 text-emerald-700" aria-hidden="true" />
          <span>{data?.meta?.total ?? data?.data?.length ?? 0} total payments</span>
        </div>
      </header>

      {isError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          Unable to load your payment records. Please refresh the page to try again.
        </div>
      ) : (
        <BasicTanstackTable
          data={data?.data ?? []}
          columns={paymentColumns}
          isLoading={isLoading}
          emptyMessage="You do not have any payment records yet."
          showRoleFilter={false}
          tableTitle="Payment history"
          recordLabel="payments"
        />
      )}
    </div>
  );
};

export default PaymentPage;
