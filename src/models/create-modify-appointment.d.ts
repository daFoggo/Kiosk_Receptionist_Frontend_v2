import { IDepartment, IOfficer } from "./department-list";

export interface IAppointment {
  id: string;
  cccd_nguoi_hen: string;
  cccd_nguoi_duoc_hen: string[];
  ngay_gio_bat_dau: string;
  ngay_gio_ket_thuc: string;
  dia_diem: string;
  muc_dich: string;
  ghi_chu?: string;
}

export interface ICreateModifyAppointmentProps {
  appointment?: Appointment;
  officers?: IOfficer[];
  department?: IDepartment[];
  convertDepartmentIdToName: (id: number) => string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}
