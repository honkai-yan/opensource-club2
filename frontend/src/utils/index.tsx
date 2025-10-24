import { checkLoginToken } from "./request";

export const checkIfLogined = async (): Promise<boolean> => {
  return await checkLoginToken();
};
