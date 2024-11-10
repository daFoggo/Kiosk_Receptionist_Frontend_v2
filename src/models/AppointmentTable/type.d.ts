export interface IAppointment {
  id: number;
  muc_dich: string;
  ngay_gio_bat_dau: string;
  ngay_gio_ket_thuc: string;
  dia_diem: string;
  trang_thai: string;
  ghi_chu: string;
  nguoi_duoc_hen: {
    name: string;
    cccd: string;
  }[];
}
