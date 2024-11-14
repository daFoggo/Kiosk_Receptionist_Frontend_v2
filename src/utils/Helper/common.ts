export const truncateText = (text: string, maxLength: number) => {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export const generateHours = (length: number) => {
  return Array.from({ length }, (_, i) => {
    const hour = i + 7 < 10 ? `0${i + 7}` : `${i + 7}`;
    return `${hour}:00`;
  });
};

export const convertRole = (role: string) => {
  switch (role) {
    case "guest":
      return "Khách";
    case "student":
      return "Sinh viên";
    case "instructor":
      return "Giảng viên";
    case "staff":
      return "Cán bộ";
    default:
      return "Không xác định";
  }
}
