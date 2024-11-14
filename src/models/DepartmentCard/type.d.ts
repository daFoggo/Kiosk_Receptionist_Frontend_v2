import { IOfficer } from "../DepartmentList/type";

export interface IDepartMentCardProps {
  code: string;
  staffs: any[];
  name: string;
  headOfDepartment: string;
  workingDays: number[];
  workingHours: number[];
  description: string;
  phoneNumber?: string;
  teleChatID?: string;
  officers: IOfficer[];
}
