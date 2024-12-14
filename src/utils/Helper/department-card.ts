export const formatWorkingHours = (hours: any) => {
  if (Array.isArray(hours) && hours.length === 2) {
    const startHour = hours[0];
    const endHour = hours[1];

    const endMinutes =
      endHour % 1 === 0
        ? "00"
        : ((endHour % 1) * 60).toString().padStart(2, "0");
    const startHourInt = Math.floor(startHour);
    const endHourInt = Math.floor(endHour);

    return `${startHourInt}:00 - ${endHourInt}:${endMinutes}`;
  }
  return "8:00 - 17:30";
};

export const formatWorkingDays = (days: any) => {
  if (Array.isArray(days) && days.length === 2) {
    return `T${days[0]} - T${days[1]}`;
  }
  return "Th2 - Th7";
};
