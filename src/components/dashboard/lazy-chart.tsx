import dynamic from "next/dynamic";
import { DashboardSkeleton } from "@/components/feedback/skeleton";
import type { ChartDataPoint } from "@/types";

export interface LazyChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  type?: "area" | "bar";
  valuePrefix?: string;
}

export const LazyChart = dynamic(
  () =>
    import("@/components/dashboard/chart-placeholder").then((mod) => mod.ChartPlaceholder),
  {
    ssr: false,
    loading: () => <DashboardSkeleton />,
  },
);
