export type TRole = "guest" | "student" | "staff";

export type IFormData = {
  role: string;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
};
