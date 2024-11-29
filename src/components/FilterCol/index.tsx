import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
const FilterCol = ({
  column,
  table,
  title,
  getDisplayValue,
}: {
  column: any;
  table: any;
  title: string;
  getDisplayValue?: (value: string) => string;
}) => {
  const uniqueValues = useMemo(() => {
    const valueSet = new Set<string>();
    table.getPreFilteredRowModel().rows.forEach((row: any) => {
      const value = row.getValue(column.id);
      if (value !== null && value !== undefined) {
        valueSet.add(String(value));
      }
    });

    return Array.from(valueSet).sort();
  }, [table, column.id]);

  const currentFilterValue = column.getFilterValue();

  return (
    <div className="w-full">
      <Select
        value={currentFilterValue ? String(currentFilterValue) : undefined}
        onValueChange={(value) => {
          column.setFilterValue(value === "all" ? undefined : value);
        }}
      >
        <SelectTrigger className="w-fit border-none bg-transparent p-0 focus-visible:ring-0">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {uniqueValues.map((value) => (
            <SelectItem key={value} value={value}>
              {getDisplayValue ? getDisplayValue(value) : value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterCol;
