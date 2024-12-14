export const dateUtils = {
  formatDate: (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },

  formatTime: (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.getHours() === 0 && date.getMinutes() === 0
      ? ""
      : date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
  },

  areDatesSame: (startDate: string, endDate: string) => {
    return (
      new Date(startDate).toDateString() === new Date(endDate).toDateString()
    );
  },
};
