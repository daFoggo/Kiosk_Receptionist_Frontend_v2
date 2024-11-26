"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ITimeSelectorProps } from "@/models/TimeSelector";
import { TIMEOPTIONS } from "@/utils/constant";

const TimeSelector = ({ value, onChange }: ITimeSelectorProps) => {
  const [customHour, setCustomHour] = useState(value.split(":")[0]);
  const [customMinute, setCustomMinute] = useState(value.split(":")[1]);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (!isCustom) {
      const [hour, minute] = value.split(":");
      setCustomHour(hour);
      setCustomMinute(minute);
    }
  }, [value, isCustom]);

  const handleCustomTimeChange = () => {
    const hour = parseInt(customHour);
    const minute = parseInt(customMinute);
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      const newTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      onChange(newTime);
      setIsCustom(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Select
        value={isCustom ? "custom" : value}
        onValueChange={(newValue) => {
          if (newValue === "custom") {
            setIsCustom(true);
          } else {
            setIsCustom(false);
            onChange(newValue);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lựa chọn thời gian" />
        </SelectTrigger>
        <SelectContent>
          {TIMEOPTIONS.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
          <SelectItem value="custom">Tùy chỉnh</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <div className="flex space-x-2">
          <Input
            type="number"
            min="0"
            max="23"
            value={customHour}
            onChange={(e) => setCustomHour(e.target.value)}
            className="w-20"
            placeholder="HH"
          />
          <span className="flex items-center">:</span>
          <Input
            type="number"
            min="0"
            max="59"
            value={customMinute}
            onChange={(e) => setCustomMinute(e.target.value)}
            className="w-20"
            placeholder="MM"
          />
          <Button onClick={handleCustomTimeChange}>Đặt</Button>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
