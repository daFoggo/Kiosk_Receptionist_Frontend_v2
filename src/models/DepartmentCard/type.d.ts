import { IDepartment, IOfficer } from "../DepartmentList/type";

export interface IDepartMentCardProps {
  department: IDepartment;
  convertDepartmentIdToName: (id: number) => string;
}
