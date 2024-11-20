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

export const convertRole = (role: string, i18n: string) => {
  switch (role) {
    case "student":
      return i18n === "en" ? "Student" : i18n === "kr" ? "학생" : "Sinh viên";
    case "teacher":
      return i18n === "en"
        ? "Teacher"
        : i18n === "kr"
        ? "선생님"
        : "Giảng viên";
    case "officer":
      return i18n === "en" ? "Officer" : i18n === "kr" ? "직원" : "Cán bộ";
    case "guest":
      return i18n === "en" ? "Guest" : i18n === "kr" ? "손님" : "Khách";
    default:
      return role;
  }
};
