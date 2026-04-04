import { AuthForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-4xl font-black tracking-tight">Forgot Password</h1>
      <AuthForm mode="forgot" />
    </main>
  );
}
