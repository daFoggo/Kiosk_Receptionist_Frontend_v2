import { useState, useEffect, useMemo } from "react";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  CalendarCheck2,
  CalendarDays,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import StatisticBlock from "@/components/StatisticBlock";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APPOINTMENT_MONTHS_SATISTICS, RECENTLY_APPOINTMENT } from "./constant";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IAppointmentDataManagement } from "@/models/AppointmentStatistics/type";
import columns from "@/models/AppointmentStatistics/columns";

const chartConfig = {
  total: {
    label: "Tổng số",
    color: "#6467f2",
  },
} satisfies ChartConfig;

const AppointmentStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState<
    IAppointmentDataManagement[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const chartStats = useMemo(() => {
    const monthStats = APPOINTMENT_MONTHS_SATISTICS.monthStats;
    const totals = monthStats.map((item) => item.total);
    const maxIndex = totals.indexOf(Math.max(...totals));
    const minIndex = totals.indexOf(Math.min(...totals));

    return {
      max: {
        value: Math.max(...totals),
        month: monthStats[maxIndex].month,
      },
      min: {
        value: Math.min(...totals),
        month: monthStats[minIndex].month,
      },
      average: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
    };
  }, []);

  const table = useReactTable({
    data: appointmentData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-4 mt-2">
        <h1 className="font-semibold text-lg sm:text-xl">Thống kê lịch hẹn</h1>

        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="w-full grid grid-cols-3 gap-4">
              {/*Overall statistics */}
              <StatisticBlock
                icon={<CalendarCheck2 className="size-4" />}
                title="Tổng số"
                value="151"
                description="lịch hẹn đã được đặt kể từ trước đến giờ"
              />
              <StatisticBlock
                icon={<CalendarDays className="size-4" />}
                title="Lịch hẹn trong tháng này"
                value="19"
                description="lịch hẹn đã được đặt trong tháng này"
              />
              <StatisticBlock
                icon={<Flame className="size-4" />}
                title="Phòng ban được đặt nhiều nhất"
                value="Phòng NCPT Công nghệ số"
                description="được đặt lịch hẹn nhiều nhất"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/*Year statistics */}
              <Card className="col-span-2 p-4">
                <CardHeader className="p-0">
                  <CardTitle>Thống kê trong năm</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ChartContainer
                    config={chartConfig}
                    className="max-h-[300px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      data={APPOINTMENT_MONTHS_SATISTICS.monthStats}
                      margin={{
                        top: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={15}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        textAnchor="middle"
                        height={60}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="total" fill="#6467f2" radius={3}>
                        <LabelList
                          position="top"
                          offset={12}
                          className="fill-foreground"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm p-0">
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground w-full">
                    <span>
                      Cao nhất:{" "}
                      <b>{`${chartStats.max.month} - ${chartStats.max.value}`}</b>
                    </span>
                    <span>
                      Trung bình: <b>{chartStats.average}</b>
                    </span>
                    <span>
                      Thấp nhất:{" "}
                      <b>{`${chartStats.min.month} - ${chartStats.min.value}`}</b>
                    </span>
                  </div>
                  <div className="flex gap-2 font-medium leading-none">
                    {APPOINTMENT_MONTHS_SATISTICS.descripStats.type === "up" ? (
                      <span>
                        Tăng
                        <b className="text-primary">
                          {` ${APPOINTMENT_MONTHS_SATISTICS.descripStats.percent}% `}
                        </b>
                        so với tháng trước
                      </span>
                    ) : (
                      <span>
                        Giảm
                        <b>
                          {` ${APPOINTMENT_MONTHS_SATISTICS.descripStats.percent}% `}
                        </b>
                        % so với tháng trước
                      </span>
                    )}
                    {APPOINTMENT_MONTHS_SATISTICS.descripStats.type === "up" ? (
                      <TrendingUp className="size-4 text-success" />
                    ) : (
                      <TrendingDown className="size-4 text-error" />
                    )}
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Thống kê tổng số lịch hẹn trong cả năm qua
                  </div>
                </CardFooter>
              </Card>

              {/*Recent apppointment */}
              <Card className="col-span-1 p-4">
                <CardHeader className="p-0">
                  <CardTitle>Lịch hẹn gần đây</CardTitle>
                  <CardDescription>Trong tuần này</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4 space-y-4">
                  <ScrollArea className="h-[300px]">
                    {RECENTLY_APPOINTMENT.map((appointment, index) => (
                      <div key={index} className="">
                        <div className="font-semibold">
                          {appointment.nguoi_hen}
                        </div>
                        <div className="text-muted-foreground text-sm line-clamp-1">
                          Người được hẹn: {appointment.nguoi_duoc_hen}
                        </div>
                        {index === RECENTLY_APPOINTMENT.length - 1 ? null : (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-left">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-left">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentStatistics;
