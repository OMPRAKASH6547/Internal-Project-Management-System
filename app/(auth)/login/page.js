"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import ErrorState from "@/components/ErrorState";
import { useProjectStore } from "@/store/useProjectStore";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const { login, register, loading, error, clearError } = useProjectStore();

  async function handleSubmit(values) {
    clearError();
    const ok = mode === "register" ? await register(values) : await login(values);
    if (ok) {
      router.push("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorState message={error} />
        <LoginForm onSubmit={handleSubmit} loading={loading} mode={mode} />
        <button
          className="mt-3 w-full text-sm font-medium text-[#ed1c24] underline underline-offset-4 hover:text-[#c9151d]"
          onClick={() => setMode((value) => (value === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<main className="flex min-h-screen items-center justify-center p-4 text-sm font-medium text-zinc-600">Loading...</main>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
