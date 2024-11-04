import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IStatisticBlockProps } from "@/models/StatisticBlock/type";

const StatisticBlock = ({
  title,
  icon,
  displayData,
  description,
}: IStatisticBlockProps) => {
  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{displayData}</div>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatisticBlock;
