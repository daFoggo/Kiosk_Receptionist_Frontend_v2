"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import axios from "axios";

import DepartmentCard from "@/components/DepartmentCard/";
import { Input } from "@/components/ui/input";

import { departmentList } from "./constant";
import { containerVariants, itemVariants } from "./motion";
import { getOfficersIp } from "@/utils/ip";

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    handleGetOfficers();
  }, []);

  const handleGetOfficers = async () => {
    try {
      const response = await axios.get(`${getOfficersIp}`);

      setOfficers(response.data.payload);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDepartments = useMemo(() => {
    return departmentList.filter(
      (dept) =>
        dept.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        dept.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 mt-2">
        <h1 className="font-semibold text-lg sm:text-2xl">
          Danh sách phòng ban
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm phòng ban..."
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-xl"
        >
          {filteredDepartments.map((department) => (
            <motion.div
              key={department.id}
              variants={itemVariants}
              className="h-full"
            >
              <DepartmentCard {...department} officers={officers} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentList;
