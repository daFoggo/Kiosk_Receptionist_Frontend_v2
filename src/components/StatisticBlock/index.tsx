import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IStatisticBlockProps } from "@/models/statistic-block";
import CountUp from "react-countup";

const StatisticBlock = ({
  icon,
  title,
  value,
  description,
}: IStatisticBlockProps) => {
  return (
    <Card className="p-4 flex flex-col justify-around">
      <CardHeader className="flex flex-row justify-between items-center font-semibold p-0 ">
        {title}
        <Button size="icon" variant="outline" className="text-muted-foreground">
          {icon}
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex flex-col justify-between">
        <div className="text-4xl font-bold">
          {
            !isNaN(Number(value)) ? (
              <CountUp end={Number(value)} duration={2.5} separator="," />
            ) : (
              <p className="text-2xl">{value}</p>
            )
          }
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticBlock;
