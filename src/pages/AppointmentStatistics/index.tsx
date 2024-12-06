import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  CalendarCheck2,
  CalendarDays,
  Flame,
  TrendingUp,
  TrendingDown,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  IAppointmentDataManagement,
  IMonthStat,
} from "@/models/AppointmentStatistics/type";
import columns from "@/models/AppointmentStatistics/columns";
import axios from "axios";
import { httpIp } from "@/utils/ip";

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
  const [statData, setStatData] = useState({});
  const [yearStatData, setYearStatData] = useState<IMonthStat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [columnVisibility, setColumnVisibility] = useState({});

  const handleGetAppointmentData = async () => {};

  const handleGetStatData = async () => {};
  const handleGetYearStatData = async () => {
    try {
      const response = await axios.get(
        `${httpIp}/appointments/stats/all-month`
      );
      setYearStatData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    handleGetAppointmentData();
    handleGetStatData();
    handleGetYearStatData();
    setIsLoading(false);
  }, []);

  // using for search
  const filteredAppointments = useMemo(() => {
    // return appointmentData.filter(
    //   (dept) =>
    //     dept..toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    //     dept.description
    //       .toLowerCase()
    //       .includes(debouncedSearchTerm.toLowerCase())
    // );
  }, [debouncedSearchTerm]);

  const chartStats = useMemo(() => {
    const totals = yearStatData?.map((item) => item.so_luong);
    const maxIndex = totals.indexOf(Math.max(...totals));
    const minIndex = totals.indexOf(Math.min(...totals));

    const currentMonthIndex = totals.length - 1;
    const previousMonthIndex = currentMonthIndex - 1;

    const currentMonthTotal = totals[currentMonthIndex];
    const previousMonthTotal = totals[previousMonthIndex];

    const description = {
      type: currentMonthTotal > previousMonthTotal ? "up" : "down",
      percent: Math.abs(Math.round((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100))
    };

    return {
      max: {
        value: Math.max(...totals),
        month: `Th${yearStatData[maxIndex]?.thang}`,
      },
      min: {
        value: Math.min(...totals),
        month: `Th${yearStatData[maxIndex]?.thang}`,
      },
      average: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
      description
    };
  }, [yearStatData]);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

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
                      data={yearStatData}
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
                    {chartStats?.description?.type === "up" ? (
                      <span>
                        Tăng
                        <b className="text-primary">
                          {` ${chartStats?.description?.percent}% `}
                        </b>
                        so với tháng trước
                      </span>
                    ) : (
                      <span>
                        Giảm
                        <b>
                          {` ${chartStats?.description?.percent}% `}
                        </b>
                        so với tháng trước
                      </span>
                    )}
                    {chartStats?.description?.type  === "up" ? (
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
                    {/* {RECENTLY_APPOINTMENT.map((appointment, index) => (
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
                    ))} */}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm lịch hẹn..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
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
