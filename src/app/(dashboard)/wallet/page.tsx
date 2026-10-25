import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WalletPage } from "@/features/wallet/wallet-page";

export default function WalletRoute() {
  return (
    <DashboardLayout>
      <WalletPage />
    </DashboardLayout>
  );
}
