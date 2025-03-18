
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { type DataItem } from "@/utils/api";

type DataTableProps = {
  data: DataItem[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  isLoading,
  page,
  pageSize,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
        <p className="text-lg animate-pulse-subtle">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="bg-muted rounded-full p-4 inline-flex mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground max-w-sm">
            Try adjusting your search filters or search term to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="overflow-x-auto glass-card rounded-xl">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Village</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Mandal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.customerName}</TableCell>
                <TableCell>{item.village}</TableCell>
                <TableCell>
                  {item.doorNumber}, {item.streetName}
                </TableCell>
                <TableCell>{item.mobile}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.mandal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} results
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
