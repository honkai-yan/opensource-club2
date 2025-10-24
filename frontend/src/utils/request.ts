import {
  captchaURL,
  checkLoginTokenURL,
  loginURL,
  autoLoginURL,
} from "@/api/apis";
import type {
  LoginRequestData,
  LoginResultData,
  ResponseResult,
} from "@/types/api";

const AppRequest = async <T, K>(
  url: string,
  method: "GET" | "POST",
  data?: T,
  header?: HeadersInit
): Promise<ResponseResult<K>> => {
  try {
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...header,
      },
      body: method === "GET" ? undefined : JSON.stringify(data),
    });

    if (!res.ok) {
      const jsonData = await res.json();
      return {
        statusCode: jsonData.statusCode,
        data: jsonData.data,
        message: jsonData.message,
      } as ResponseResult<K>;
    }

    const resData = await res.json();
    return {
      statusCode: resData.statusCode,
      data: resData.data,
      message: resData.message,
    } as ResponseResult<K>;
  } catch (error: any) {
    return {
      statusCode: -1,
      data: null,
      message: error.message,
    } as ResponseResult<K>;
  }
};

export const checkLoginToken = async (): Promise<boolean> => {
  const res = await AppRequest(checkLoginTokenURL, "GET");
  return res.statusCode === 200;
};

export const login = async (
  data: LoginRequestData
): Promise<ResponseResult<LoginResultData>> => {
  return await AppRequest<LoginRequestData, LoginResultData>(
    loginURL,
    "POST",
    data
  );
};

export const autoLogin = async (): Promise<ResponseResult<LoginResultData>> => {
  return await AppRequest<LoginRequestData, LoginResultData>(
    autoLoginURL,
    "POST"
  );
};

export const getCaptchaData = async (): Promise<ResponseResult<string>> => {
  try {
    const res = await fetch(captchaURL + `?${Date.now()}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      return {
        statusCode: 200,
        data: await res.text(),
        message: "",
      };
    } else {
      return {
        statusCode: 500,
        data: "",
        message: "获取验证码失败",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      data: "",
      message: "获取验证码失败",
    };
  }
};
