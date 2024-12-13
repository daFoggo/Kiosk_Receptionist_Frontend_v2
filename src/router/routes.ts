export const routes = {
  home: "/",

  login: "/auth/login",

  appointment: {
    dashboard: "/appointment",
    myAppointment: (params?: { id?: string }) =>
      params?.id
        ? `${routes.appointment.dashboard}/my-appointments/${params.id}`
        : `${routes.appointment.dashboard}/my-appointments`,
    departmentList: (params?: { id?: string }) =>
      params?.id
        ? `${routes.appointment.dashboard}/department-list/${params.id}`
        : `${routes.appointment.dashboard}/department-list`,
  },

  notFound: "*",
};
