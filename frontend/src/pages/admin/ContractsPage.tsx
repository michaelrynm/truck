import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { contractsApi } from "@/api/contracts.api";
import { Contract, ContractFormData } from "@/types";
import { contractSchema } from "@/utils/validators";
import { formatDate, formatCurrency } from "@/utils/formatters";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Table from "@/components/common/Table";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import StatusBadge from "@/components/common/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";

const ContractsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const { data: result, isLoading } = useQuery({
    queryKey: ["contracts", currentPage],
    queryFn: () =>
      contractsApi.getAll(undefined, { page: currentPage, limit: 10 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  const createMutation = useMutation({
    mutationFn: contractsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract created successfully");
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create contract");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ContractFormData>;
    }) => contractsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract updated successfully");
      setIsModalOpen(false);
      setEditingContract(null);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update contract");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contractsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contract deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete contract");
    },
  });

  const handleCreate = () => {
    setEditingContract(null);
    reset({});
    setIsModalOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    reset({
      clientName: contract.clientName,
      location: contract.location,
      startDate: contract.startDate.split("T")[0],
      endDate: contract.endDate.split("T")[0],
      numberOfTrucks: contract.numberOfTrucks,
      price: contract.price,
      physicalActivityPercentage: contract.physicalActivityPercentage || undefined,
      status: contract.status,
      description: contract.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ContractFormData) => {
    if (editingContract) {
      updateMutation.mutate({ id: editingContract.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const columns = [
    { header: "Client", accessor: "clientName" as keyof Contract },
    { header: "Location", accessor: "location" as keyof Contract },
    {
      header: "Start Date",
      accessor: (row: Contract) => formatDate(row.startDate),
    },
    {
      header: "End Date",
      accessor: (row: Contract) => formatDate(row.endDate),
    },
    { header: "Trucks", accessor: "numberOfTrucks" as keyof Contract },
    {
      header: "Price",
      accessor: (row: Contract) => formatCurrency(row.price),
    },
    {
      header: "Status",
      accessor: (row: Contract) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: (row: Contract) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Card
        title="Contracts Management"
        actions={<Button onClick={handleCreate}>Create Contract</Button>}
      >
        <Table columns={columns} data={result?.data || []} />
        {result?.pagination && (
          <Pagination
            currentPage={result.pagination.page}
            totalPages={result.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContract(null);
          reset();
        }}
        title={editingContract ? "Edit Contract" : "Create Contract"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Client Name"
              {...register("clientName")}
              error={errors.clientName?.message}
            />

            <Input
              label="Location"
              {...register("location")}
              error={errors.location?.message}
            />

            <Input
              label="Start Date"
              type="date"
              {...register("startDate")}
              error={errors.startDate?.message}
            />

            <Input
              label="End Date"
              type="date"
              {...register("endDate")}
              error={errors.endDate?.message}
            />

            <Input
              label="Number of Trucks"
              type="number"
              {...register("numberOfTrucks", { valueAsNumber: true })}
              error={errors.numberOfTrucks?.message}
            />

            <Input
              label="Price/Ton/Km"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              error={errors.price?.message}
            />

            <Input
              label="Phisical Availability %"
              type="number"
              step="0.01"
              {...register("physicalActivityPercentage", { valueAsNumber: true })}
              error={errors.physicalActivityPercentage?.message}
            />

            <Select
              label="Status"
              {...register("status")}
              error={errors.status?.message}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
            />
          </div>

          <Input
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingContract(null);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingContract ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContractsPage;
