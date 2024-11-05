export type TRole = "guest" | "student" | "staff";

export type IFormData = {
  role: TRole;
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
};
