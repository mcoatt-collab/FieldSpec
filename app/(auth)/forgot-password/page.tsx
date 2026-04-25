"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ email: false });
  const [changed, setChanged] = useState({ email: false });
  const [focused, setFocused] = useState({ email: false });

  const isValidEmailFormat = (email: string) => {
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    
    if (allowedDomains.includes(domain)) return true;
    
    if (domain.includes(".")) return true;
    
    return false;
  };

  const emailFormatError = touched.email && email && !isValidEmailFormat(email) && !focused.email ? "Invalid email address" : "";
  const showEmailBorder = touched.email && email && !isValidEmailFormat(email) && !focused.email;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setChanged({ ...changed, email: true });
  };

  const handleEmailBlur = () => {
    setFocused({ ...focused, email: false });
    setTouched({ ...touched, email: true });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage(data.data?.message || "Check your email for reset instructions.");
      setEmail("");
    } catch {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <style jsx>{`
        input {
          transition: box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
        }
        input:focus {
          box-shadow: 0 0 0 2px rgba(103, 58, 183, 0.08);
        }
        input:disabled {
          box-shadow: none;
        }
        input.email-error-focus {
          border-color: var(--sys-error) !important;
        }
        button[type="submit"]:hover:not(:disabled) {
          background-color: var(--sys-state-hovered);
          color: var(--sys-on-primary);
        }
        button[type="submit"]:active:not(:disabled) {
          background-color: var(--sys-state-pressed);
          color: var(--sys-on-primary);
          box-shadow: none;
          transform: translateY(1px);
        }
      `}</style>
      <h1 className="text-center mb-lg text-on-surface text-headline-medium" style={{ fontSize: "calc(var(--sys-typescale-headline-medium-fontsize) - 5px)", marginTop: "8px" }}>
        Forgot Password
      </h1>
      
      <p className="text-center text-on-surface-variant text-body-medium" style={{ marginTop: "-36px", lineHeight: "15px" }}>
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label htmlFor="email" className="block mb-xs text-on-surface text-label-medium">
            Email <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute pointer-events-none" style={{ color: "var(--sys-on-surface-variant)", left: "12px", fontSize: "20px" }}>
              mail
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onFocus={() => setFocused({ ...focused, email: true })}
              required
              placeholder=" "
              autoComplete="off"
              className={"w-full box-border px-md py-[14px] border border-outline rounded-sm bg-surface text-on-surface focus:outline-1 focus:outline-primary text-body-medium transition-all duration-200" + (showEmailBorder ? " email-error-focus" : "")}
              style={{ paddingLeft: "34px" }}
            />
          </div>
          {emailFormatError && (
            <p className="mt-xs text-body-small" style={{ color: "var(--sys-error)" }}>{emailFormatError}</p>
          )}
        </div>

        {error && (
          <div className="p-md bg-error-container text-on-error-container rounded-sm mb-md text-body-small">
            {error}
          </div>
        )}

        {message && (
          <div className="p-md bg-success-container text-on-success-container rounded-sm mb-md text-body-small">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary rounded-sm cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ fontSize: "16px", fontWeight: 500, padding: "12px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
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