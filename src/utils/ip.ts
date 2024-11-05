export const httpIp = import.meta.env.VITE_BACKEND_IP;
export const wsIp = import.meta.env.VITE_WEBSOCKET_IP;
export const openWeatherIp = import.meta.env.VITE_OPENWEATHER_API;

export const authIp = `${httpIp}/auth`;
export const verifyTokenIp = `${authIp}/verify-token`;
export const loginIp = `${authIp}/login`;

export const getIdentifyDataIp = `${httpIp}/identity-data/get`;
export const updateIdentifyDataIp = `${httpIp}/identity-data/update`;

export const getInstitueCalendarIp = `${httpIp}/institude-calendar/get`;
export const updateInstitueCalendarIp = `${httpIp}/institude-calendar/post`;

export const createEventIp = `${httpIp}/create-event`;
export const getEventsIp = `${httpIp}/get-events`;
export const putEventIp = `${httpIp}/put-event`;
export const deleteEventIp = `${httpIp}/delete-event`;

