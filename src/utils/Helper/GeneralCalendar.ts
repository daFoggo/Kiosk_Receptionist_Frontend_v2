export const formatDateForApi = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  export const generateHours = () => {
    return Array.from({ length: 17 }, (_, i) => {
      const hour = i + 6 < 10 ? `0${i + 6}` : `${i + 6}`;
      return `${hour}:00`;
    });
  };
  
  export const generateWeekDays = (date: Date) => {
    const week = [];
    const monday = new Date(date);
    const currentDay = date.getDay();
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    monday.setDate(date.getDate() - daysToMonday);
  
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };
  
  export const parseDate = (dateString: string) => {
    const [time, date] = dateString.split(" ");
    const [day, month, year] = date.split("/");
    const [hour, minute] = time.split(":");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  };
  
  export const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };
  
  export const isCurrentHour = (hour: string) => {
    const currentHour = new Date().getHours();
    return parseInt(hour) === currentHour;
  };
  
  export const isCurrentDate = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  export const convertColor = (value: string, type: string) => {
    if (type === "badge") {
      if (value === "Lịch học" || value === "Lịch giảng dạy") {
        return "bg-primary hover:bg-primary/90";
      } else if (value === "Lịch thực hành") {
        return "bg-sand hover:bg-sand/90 text-sub-text1";
      }
    } else if (type === "div") {
      if (value === "Lịch học" || value === "Lịch giảng dạy") {
        return "bg-[#dfe8ff]  border-[#7287fd] hover:bg-[#c5d4ff]";
      } else if (value === "Lịch thực hành") {
        return "bg-[#f9f3a7]  border-[#efd020] hover:bg-[#f4e065]";
      }
    }
  };
  