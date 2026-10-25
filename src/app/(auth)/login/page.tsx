import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
