import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { activitiesApi } from "@/api/activities.api";
import { ActivityLog } from "@/types";
import { formatDate, formatDateTime } from "@/utils/formatters";
import Card from "@/components/common/Card";
import Table from "@/components/common/Table";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";

const ActivitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const { data: result, isLoading } = useQuery({
    queryKey: ["activities", currentPage],
    queryFn: () => activitiesApi.getAll({ page: currentPage, limit: 10 }),
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const columns = [
    {
      header: "Driver",
      accessor: (row: ActivityLog) => row.driver?.name || "N/A",
    },
    {
      header: "Truck",
      accessor: (row: ActivityLog) => row.dumpTruck?.plateNumber || "N/A",
    },
    {
      header: "Date",
      accessor: (row: ActivityLog) => formatDate(row.date),
    },
    {
      header: "Start Time",
      accessor: (row: ActivityLog) => row.startTime,
    },
    {
      header: "End Time",
      accessor: (row: ActivityLog) =>
        row.endTime ? row.endTime : "In Progress",
    },
    {
      header: "Loads",
      accessor: "numberOfLoads" as keyof ActivityLog,
    },
    {
      header: "Location",
      accessor: "location" as keyof ActivityLog,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card title="Activity Logs">
        <Table columns={columns} data={result?.data || []} />
        {result?.pagination && (
          <Pagination
            currentPage={result.pagination.page}
            totalPages={result.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
};

export default ActivitiesPage;
