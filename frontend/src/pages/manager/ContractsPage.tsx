import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { contractsApi } from '@/api/contracts.api';
import { Contract } from '@/types';
import { formatDate, formatCurrency } from '@/utils/formatters';
import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import StatusBadge from '@/components/common/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const ContractsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: result, isLoading } = useQuery({
    queryKey: ['contracts', currentPage],
    queryFn: () => contractsApi.getAll(undefined, { page: currentPage, limit: 10 }),
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const columns = [
    { header: 'Client', accessor: 'clientName' as keyof Contract },
    { header: 'Location', accessor: 'location' as keyof Contract },
    {
      header: 'Start Date',
      accessor: (row: Contract) => formatDate(row.startDate),
    },
    {
      header: 'End Date',
      accessor: (row: Contract) => formatDate(row.endDate),
    },
    { header: 'Trucks', accessor: 'numberOfTrucks' as keyof Contract },
    {
      header: 'Price',
      accessor: (row: Contract) => formatCurrency(row.price),
    },
    {
      header: 'Status',
      accessor: (row: Contract) => <StatusBadge status={row.status} />,
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card title="Contracts">
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

export default ContractsPage;
