export const indexBackgroundBaseURL =
  "https://resource-1317825917.cos.ap-chengdu.myqcloud.com/class-site-imgs/";
const serviceBaseURL = import.meta.env.VITE_SERVICE_BASE_URL;

const authBaseURL = `${serviceBaseURL}/auth`;
export const checkLoginTokenURL = `${authBaseURL}/checkLoginToken`;
export const loginURL = `${authBaseURL}/login`;
export const captchaURL = `${authBaseURL}/getCaptcha`;
