import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import qs from "qs";
import { sessionRefresh } from "@/features/session/http/mutations/sessionMutations";

const createAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
};

createAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // WI#5: catch mid-session billing-state flips (e.g. tenant was
    // `:trialing` at login but Stripe webhook just landed `:canceled`).
    // Backend hard-blocks return 403 with `error: "billing_blocked"`;
    // we redirect to /configuracoes UNLESS we're already there — that
    // single guard prevents the post-checkout `?checkout=success`
    // polling loop. We use `window.location.assign` (NOT reload) so
    // React Router's tree fully unmounts and the BillingGate re-mounts
    // with a fresh status query.
    if (
      error.response?.status === 403 &&
      error.response?.data?.error === "billing_blocked"
    ) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/configuracoes"
      ) {
        window.location.assign("/configuracoes");
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.request.responseURL.includes("/api/sessions/refresh")) {
        localStorage.removeItem("is_authenticated");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return createAxios(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await sessionRefresh();
        processQueue(null);
        return createAxios(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const get = (
  path: string,
  params?: AxiosRequestConfig["params"],
  headers?: AxiosRequestConfig["headers"],
) => {
  return createAxios.get(path, {
    params,
    paramsSerializer: (params) => {
      const paramsWithoutUndefined = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined),
      );

      return qs.stringify(paramsWithoutUndefined, { arrayFormat: "brackets" });
    },
    headers,
  });
};

const post = (path: string, data?: object, config?: AxiosRequestConfig) => {
  return createAxios.post(path, data, config);
};

const put = (path: string, data?: object, config?: AxiosRequestConfig) => {
  return createAxios.put(path, data, config);
};

const del = (path: string) => {
  return createAxios.delete(path);
};

const patch = (path: string, data?: object) => {
  return createAxios.patch(path, data);
};

const request = async <T, C = any>(promise: Promise<AxiosResponse<T>>) => {
  try {
    return (await promise).data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.errors) {
        throw error.response?.data?.errors as C;
      }
    }

    throw error;
  }
};

export const api = {
  get: <T>(
    path: string,
    params?: AxiosRequestConfig["params"],
    headers?: AxiosRequestConfig["headers"],
  ) => request<T>(get(path, params, headers)),
  post: <T, C = any>(
    path: string,
    data?: object,
    config?: AxiosRequestConfig,
  ) => request<T, C>(post(path, data, config)),
  put: <T, C = any>(path: string, data?: object, config?: AxiosRequestConfig) =>
    request<T, C>(put(path, data, config)),
  delete: <T>(path: string) => request<T>(del(path)),
  patch: <T>(path: string, data?: object) => request<T>(patch(path, data)),
};
