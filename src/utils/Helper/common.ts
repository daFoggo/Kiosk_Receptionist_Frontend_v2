import { verifyTokenIp } from "../ip";
import axios from "axios";

export const isTokenValid = async (token?: string | null) => {
  if (!token) {
    return { success: false, message: "No token" };
  }

  try {
    const response = await axios.get(`${verifyTokenIp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid token",
    };
  }
};

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
