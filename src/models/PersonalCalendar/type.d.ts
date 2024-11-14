export interface IPersonalCalendarProps {
  currentRole: string;
  currentCccd: string;
}

export interface IPersonalCalendarData {
  hoc_phan: IHocPhan;
  loai_lich: string;
  ngay_gio_bat_dau: string;
  ngay_gio_ket_thuc: string;
  tiet_bat_dau: string;
  so_tiet: string;
  phong: string;
  nha?: string;
  can_bo: ICanBo;
}

export interface ICanBo {
  ma_can_bo: string;
  ho_ten: string;
  email: string;
}

export interface IHocPhan {
  ma_hoc_phan: string;
  ten_hoc_phan: string;
  so_tin_chi: string;
}
