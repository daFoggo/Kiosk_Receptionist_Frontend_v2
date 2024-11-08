export const formatWorkingHours = (hours: any) => {
  if (Array.isArray(hours) && hours.length === 2) {
    return `${hours[0]}:00 - ${hours[1]}:00`;
  }
  return "8:00 - 17:30";
};

export const formatWorkingDays = (days: any) => {
  if (Array.isArray(days) && days.length === 2) {
    return `T${days[0]} - T${days[1]}`;
  }
  return "T2 - T7";
};
