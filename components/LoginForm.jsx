"use client";

import { useState } from "react";

export default function LoginForm({ onSubmit, loading, mode = "login" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ name, email, password });
      }}
      className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white/95 p-6 shadow-sm backdrop-blur"
    >
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
        {isRegister ? "Create account" : "Internal Project Management"}
      </h1>
      {isRegister ? (
        <input
          className="mb-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      ) : null}
      <input
        className="mb-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        className="mb-4 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#ed1c24] py-2 text-white transition hover:bg-[#c9151d] disabled:opacity-60"
      >
        {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
      </button>
      <p className="mt-3 text-xs text-zinc-500">
        Use a valid email and password with at least 8 characters.
        {isRegister ? " Name must be at least 2 characters." : ""}
      </p>
    </form>
  );
}
