import type { ApiSuccessResponse } from "@/types";
import type { PaginationMeta } from "@/types/api.types";

export function extractMeta(response: ApiSuccessResponse<unknown>): PaginationMeta | undefined {
  return response.meta;
}

export function extractNestedMeta<T extends { meta?: PaginationMeta }>(
  data: T,
): PaginationMeta | undefined {
  return data.meta;
}
