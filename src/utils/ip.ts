const backendIp = import.meta.env.VITE_BACKEND_IP;

const authIp = `${backendIp}/auth`;
const verifyTokenIp = `${authIp}/verify-token`;
const loginIp = `${authIp}/login`;
const getIdentifyDataIp = `${backendIp}/get-identify-data`;
const getInstitueCalendarIp = `${backendIp}/get-lich-tuan`;
const updateInstitueCalendarIp = `${backendIp}/post-lich-tuan`;
const createEventIp = `${backendIp}/create-event`;
const getEventsIp = `${backendIp}/get-events`;
const putEventIp = `${backendIp}/put-event`;
const deleteEventIp = `${backendIp}/delete-event`;
const imageUploadIp = `${backendIp}/post-personal-img`;

const openWeatherIp = import.meta.env.VITE_OPENWEATHER_API;
export {
  backendIp,
  authIp,
  verifyTokenIp,
  loginIp,
  getIdentifyDataIp,
  getInstitueCalendarIp,
  updateInstitueCalendarIp,
  createEventIp,
  getEventsIp,
  putEventIp,
  deleteEventIp,
  imageUploadIp,
  openWeatherIp,
};
