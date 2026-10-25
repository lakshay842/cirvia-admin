import { API_BASE_URL } from "@/constants";

/** Health probes mount at API root, not under /api/v1 */
export const API_ROOT_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
