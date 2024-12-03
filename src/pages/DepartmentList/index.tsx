"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import axios from "axios";

import DepartmentCard from "@/components/DepartmentCard/";
import { Input } from "@/components/ui/input";

import { containerVariants, itemVariants } from "./motion";
import { getDepartmentIp } from "@/utils/ip";
import { IDepartment } from "@/models/DepartmentList/type";

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${getDepartmentIp}`);
      setDepartments(response.data.payload);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch departments");
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments?.filter((dept) =>
      dept.ten_phong_ban
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [departments, debouncedSearchTerm]);

  const convertDepartmentIdToName = (id: number) => {
    const department = departments.find((dept) => dept.id === id);
    return department?.ten_phong_ban || 'Không xác định';
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return <div>Loading departments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        {filteredDepartments.length === 0 ? (
          <div>Không tìm thấy phòng ban</div>
        ) : (
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
                <DepartmentCard department={department} convertDepartmentIdToName={convertDepartmentIdToName} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
