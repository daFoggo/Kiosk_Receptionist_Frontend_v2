import { IDepartment, IOfficer } from "./department-list";

export interface IDepartMentCardProps {
  department: IDepartment;
  convertDepartmentIdToName: (id: number) => string;
}
