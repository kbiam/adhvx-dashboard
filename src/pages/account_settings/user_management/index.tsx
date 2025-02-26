import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { dataService } from "@/dataservice";
import { BasicUserInfo } from "@/utils/types";
import { AddUser } from "./add_user";
import { EditUser } from "./edit_user";

const columns: ColumnDef<BasicUserInfo>[] = [
  {
    accessorKey: "Name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => (
      <div className="capitalize text-left">{row.getValue("Name")}</div>
    ),
  },
  {
    accessorKey: "Email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => (
      <div className="lowercase text-left">{row.getValue("Email")}</div>
    ),
  },
  {
    accessorKey: "Role",
    header: () => <div className="text-left">Role</div>,
    cell: ({ row }) => {
      const role: string = row.getValue("Role") || "";
      const formattedRoleName = role.replace("_", " ");
      return <div className="capitalize text-left">{formattedRoleName}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <EditUser userData={row.original} />;
    },
  },
];

export function UserManagement() {
  const [userList, setUserList] = useState<BasicUserInfo[]>([]);
  const table = useReactTable({
    data: userList,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  interface UserListResponse {
    users: BasicUserInfo[];
  }

  useEffect(() => {
    async function fetchUserList() {
      try {
        const response: UserListResponse = await dataService.get(
          "/admin/user/list"
        );
        setUserList(response.users);
      } catch (error) {
        console.error("Failed to fetch user list", error);
      }
    }

    fetchUserList();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center pb-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("Email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddUser />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
