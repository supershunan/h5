import { history } from "umi";
import { CustomRequestInit } from "./request.type";
import { Toast } from "antd-mobile";

const isDev = process.env.NODE_ENV === "development";
const BASE_URL = isDev ? "https://kzt.lddian.com/" : "https://kzt.lddian.com/";

export default async function request(
  path: string,
  options?: CustomRequestInit
): Promise<T> {
  const Token = localStorage.getItem("Token") || "";
  const tokenTime = window.localStorage.getItem("TokenTime");
  const currentTime = new Date().getTime();

  // 检查token是否小于12小时过期
  const isOverdue = tokenTime
    ? currentTime - new Date(Number(tokenTime)).getTime() > 12 * 60 * 60 * 1000
    : true;

  // 请求拦截
  if (!options?.skipAuth) {
    if (!Token || isOverdue) {
      history.push("/login");
      Toast.show({
        icon: "fail",
        content: "登录信息过期",
      });
      return Promise.reject();
    }
  }
  console.log(path)
  if (isOverdue && !path.includes('loginForH5')) {
    history.push("/login");
      Toast.show({
        icon: "fail",
        content: "登录信息过期",
      });
      return Promise.reject();
  }

  // 重置 headers
  const headers: HeadersInit = {
    ...options?.headers,
    "Content-Type": "application/json",
    Authorization: Token,
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  };
  const updateOptions: RequestInit = {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  };

  const fetchPromise = await fetch(BASE_URL + path, updateOptions);

  // 超时时间
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("Request timed out")),
      options?.timeout || 5000
    )
  );

  try {
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    const data = (await response.json()) as T;

    if (data.code === 10003) {
      // 根据后端返回的code来判断
      history.push("/login");
      Toast.show({
        icon: "fail",
        content: "登录信息过期",
      });
      return Promise.reject();
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return Promise.reject(error);
  }
}
