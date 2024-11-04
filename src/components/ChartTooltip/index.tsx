import { IChartTooltipProps } from "@/models/ChartTooltip/type";

const ChartToooltip = ({ active, payload, label }: IChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid gap-1">
            <div className="font-medium">{label}</div>
            <div className="text-sm text-muted-foreground">
              tasks : {payload[0].value}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

export default ChartToooltip;