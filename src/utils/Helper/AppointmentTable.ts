export const getStatusColor = (status: string) => {
  switch (status) {
    case "Đã xác nhận":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-800";
    case "Chờ xác nhận":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800";
    case "Đã hủy":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700";
  }
};
