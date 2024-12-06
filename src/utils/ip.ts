export const backendIp = import.meta.env.VITE_BACKEND_IP;
export const httpIp = import.meta.env.VITE_BACKEND_API;
export const wsIp = import.meta.env.VITE_WEBSOCKET_IP;
export const openWeatherIp = import.meta.env.VITE_OPENWEATHER_API;

export const authIp = `${httpIp}/auth`;
export const loginIp = `${authIp}/login`;
export const registerIp = `${authIp}/register`;

export const getIdentifyDataIp = `${httpIp}/identity-data/get`;
export const updateIdentifyDataIp = `${httpIp}/identity-data/update`;

export const getInstitueCalendarIp = `${httpIp}/institude-calendar/get`;
export const updateInstitueCalendarIp = `${httpIp}/institude-calendar/post`;

export const createEventIp = `${httpIp}/create-event`;
export const getEventsIp = `${httpIp}/get-events`;
export const putEventIp = `${httpIp}/put-event`;
export const deleteEventIp = `${httpIp}/delete-event`;

export const getStudentCalendarIp = `${httpIp}/class-calendar/get/by-role`;
export const getInstructorCalendarIp = `${httpIp}/instructor-calendar/get/by-role`;
export const getAllStudentCalendarIp = `${httpIp}/all-class-calendar/get/by-role`;
export const getAllInstructorCalendarIp = `${httpIp}/all-instructor-calendar/get/by-role`;

export const getDepartmentIp = `${httpIp}/departments/get`;
export const getClassIp =  `${httpIp}/administrative-class/get`;
export const getOfficerIp = `${httpIp}/officer/get/by-departments`;

export const getAppointmentsIp = `${httpIp}/appointments/stats/by-user`;
export const createAppointmentIp = `${httpIp}/appointments/create`;
export const updateAppointmentIp = `${httpIp}/appointments/update/by-user`;

