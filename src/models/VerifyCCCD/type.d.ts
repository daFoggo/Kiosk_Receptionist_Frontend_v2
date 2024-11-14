export type TRole = "guest" | "student" | "staff";

export type IFormData = {
  role: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
};

export interface ICCCDData {
  "Identity Code": string;
  Name: string;
  DOB: string;
  Gender: string;
}
