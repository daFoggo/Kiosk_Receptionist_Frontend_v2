export const convertFormKey = (key: string) => {
  switch (key) {
    case "role":
      return "Vai trò";
    case "fullName":
      return "Họ và tên";
    case "idNumber":
      return "Mã số CCCD";
    case "dateOfBirth":
      return "Ngày sinh";
    case "gender":
      return "Giới tính";
    default:
      break;
  }
};
