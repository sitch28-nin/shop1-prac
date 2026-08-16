'use client';

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/products");
    router.refresh();
  };

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center">
      <div className="panel w-full max-w-md p-8">
        <p className="soft-badge mb-4">Welcome back</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">เข้าสู่ระบบ</h1>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <button onClick={handleLogin} className="primary-btn w-full">
            เข้าสู่ระบบ
          </button>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;