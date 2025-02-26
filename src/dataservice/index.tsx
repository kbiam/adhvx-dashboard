import { useAccountStore } from "@/store/account.store";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost.stellarhub.in"
}

const constructURL = (url: string) => {
  const accountId = useAccountStore.getState()._id;
  return url.includes("/api") ? url : `/api/${accountId}${url}`;
};

interface APIError {
  error: APIErrorObj;
}
interface APIErrorObj {
  message: string;
  statusCode: number;
}

class DataService {
  // Private method to handle success and error responses
  private handleResponse<T>(res: AxiosResponse<T>): T {
    return res.data; // Return only the data from the response with a typed response
  }

  private handleError(err: AxiosError): void {
    if (axios.isAxiosError(err) && err.response) {
      const errorObject = err.response.data as APIError;

      if (errorObject.error.statusCode === 401) {
        // Redirect to login page on 401
        if (!window.location.href.endsWith("/login")) {
          window.location.href = "/login";
        }
      }

      // Display error message via toast notification
      toast(errorObject.error.message || "An unexpected error occurred", {
        type: "error",
      });
    } else {
      // Handle network errors
      toast("Network error", { type: "error" });
    }
  }

  // GET method
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .get<T>(constructURL(url), config)
      .then(this.handleResponse)
      .catch((err) => {
        this.handleError(err);
        return Promise.reject(err);
      });
  }

  // POST method
  post<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .post<T>(constructURL(url), data, config)
      .then(this.handleResponse)
      .catch((err) => {
        this.handleError(err);
        return Promise.reject(err);
      });
  }

  // PUT method
  put<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .put<T>(constructURL(url), data, config)
      .then(this.handleResponse)
      .catch((err) => {
        this.handleError(err);
        return Promise.reject(err);
      });
  }

  // PATCH method
  patch<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .patch<T>(constructURL(url), data, config)
      .then(this.handleResponse)
      .catch((err) => {
        this.handleError(err);
        return Promise.reject(err);
      });
  }

  // DELETE method
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .delete<T>(constructURL(url), config)
      .then(this.handleResponse)
      .catch((err) => {
        this.handleError(err);
        return Promise.reject(err);
      });
  }
}

interface DataServiceMethods {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data: object, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export const dataService: DataServiceMethods = new DataService();
