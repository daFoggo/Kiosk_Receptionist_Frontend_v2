export type TRole = "guest" | "student" | "staff";

export type IFormData = {
  role: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  department: string;
};

export interface ICCCDData {
  "Identity Code": string;
  Name: string;
  DOB: string;
  Gender: string;
}

export interface IClass {
  id: number;
  ten_lop_hanh_chinh: string;
}

export interface IVerifyCCCDProps {
  onClose?: () => void;
}
