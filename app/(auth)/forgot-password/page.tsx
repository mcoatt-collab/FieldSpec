"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <h1 className="text-center mb-lg text-on-surface text-headline-medium" style={{ fontSize: "calc(var(--sys-typescale-headline-medium-fontsize) - 10px)", marginTop: "8px" }}>
        Forgot Password
      </h1>
      
      <p className="text-center mb-md text-on-surface-variant text-body-medium">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            required
            placeholder=" "
            autoComplete="off"
            className="w-full box-border px-md py-sm border border-outline rounded-sm bg-surface text-on-surface focus:outline-1 focus:outline-primary text-body-medium transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-on-primary rounded-sm cursor-pointer hover:bg-primary-container hover:text-on-primary-container text-label-large transition-all duration-200"
          style={{ padding: "12px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
        >
          Send Reset Link
        </button>
      </form>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        <Link href="/login" className="text-primary">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
