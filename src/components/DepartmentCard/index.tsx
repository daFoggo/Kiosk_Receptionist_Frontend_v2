"use client";

import { Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CreateModifyAppointment from "@/components/CreateModifyAppointment";
import {
  formatWorkingDays,
  formatWorkingHours,
} from "@/utils/Helper/DepartmentCard";
import { IDepartMentCardProps } from "@/models/DepartmentCard/type";
import { useEffect, useState } from "react";
import { IOfficer } from "@/models/DepartmentList/type";
import { getOfficerIp } from "@/utils/ip";
import axios from "axios";

const DepartmentCard = ({ department, convertDepartmentIdToName }: IDepartMentCardProps) => {
  const [officers, setOfficers] = useState<IOfficer[]>([]);

  useEffect(() => {
    handleGetOfficers();
  }, []);

  const handleGetOfficers = async () => {
    try {
      const response = await axios.get(
        `${getOfficerIp}?phong_ban_id=${department.id}`
      );
      setOfficers(response.data.payload);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-sm transition-all duration-300 overflow-hidden group hover:shadow-sm hover:shadow-primary/25 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="font-semibold text-muted-foreground"
            >
              {department.ten_phong_ban
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 font-semibold"
            >
              <Users className="w-3 h-3" />
              {officers.length}
            </Badge>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">
            {department.ten_phong_ban}
          </CardTitle>
          <Separator />
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-2">
              {formatWorkingDays([2, 7])}, {formatWorkingHours([8, 17.3])}
            </span>
          </div>
        </CardContent>

        <CardFooter className="mt-auto pt-4 z-10">
          <CreateModifyAppointment officers={officers} convertDepartmentIdToName={convertDepartmentIdToName}/>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DepartmentCard;
