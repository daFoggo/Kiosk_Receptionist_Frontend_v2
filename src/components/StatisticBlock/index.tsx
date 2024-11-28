"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IStatisticBlockProps } from "@/models/StatisticBlock/type";
import CountUp from "react-countup";

const StatisticBlock = ({
  icon,
  title,
  value,
  description,
}: IStatisticBlockProps) => {
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row justify-between items-center font-semibold p-0 ">
        {title}
        <Button size="icon" variant="outline" className="text-muted-foreground">
          {icon}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-4xl font-bold">
          <CountUp end={Number(value)} duration={2.5} separator="," />
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticBlock;
