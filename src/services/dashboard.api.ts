import axios from "axios";
import { API_ROOT_URL } from "@/lib/health-url";
import { apiClient } from "@/services/api-client";
import type {
  ActivityItem,
  ApiSuccessResponse,
  ChartDataPoint,
  DashboardStat,
  LoginCredentials,
  SystemHealthItem,
} from "@/types";
import type { ApiAuthUser } from "@/lib/admin-user";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiAuthUser;
}

export interface DashboardSummary {
  stats: DashboardStat[];
  revenueChart: ChartDataPoint[];
  bookingChart: ChartDataPoint[];
  recentActivity: ActivityItem[];
  systemHealth: SystemHealthItem[];
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiSuccessResponse<LoginResponse>>("/auth/login", credentials),
  logout: (refreshToken?: string) =>
    apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {}),
  refresh: (refreshToken: string) =>
    apiClient.post<ApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(
      "/auth/refresh",
      { refreshToken },
    ),
  me: () => apiClient.get<ApiSuccessResponse<ApiAuthUser>>("/users/me"),
};

export const dashboardApi = {
  summary: () =>
    apiClient.get<ApiSuccessResponse<DashboardSummary>>("/admin/dashboard"),
  statistics: (period: string) =>
    apiClient.get<ApiSuccessResponse<DashboardSummary>>("/admin/statistics", {
      params: { period },
    }),
};

export const healthApi = {
  check: () => axios.get(`${API_ROOT_URL}/health`, { timeout: 10000 }),
  ready: () => axios.get(`${API_ROOT_URL}/ready`, { timeout: 10000 }),
  live: () => axios.get(`${API_ROOT_URL}/live`, { timeout: 10000 }),
};
