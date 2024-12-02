import { ColumnDef } from "@tanstack/react-table";
import { IAppointmentDataManagement } from "./type";

const columns: ColumnDef<IAppointmentDataManagement>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ table, row }) => {
      const filteredRows = table.getFilteredRowModel().rows;

      const index = filteredRows.findIndex(
        (filteredRow) =>
          filteredRow.getValue("name") === row.getValue("name") &&
          filteredRow.getValue("cccd_id") === row.getValue("cccd_id")
      );

      return index !== -1 ? index + 1 : "";
    },
  },
  {
    accessorKey: "name",
    header: "Người hẹn",
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: "Người được hẹn",
    enableColumnFilter: false,
  },
  {
    accessorKey: "department_name",
    header: "Phòng ban",
    enableColumnFilter: false,
  },
  {
    accessorKey: "date",
    header: "Thời gian",
    enableColumnFilter: false,
  },
];

export default columns;
