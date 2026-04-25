"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [focused, setFocused] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [changed, setChanged] = useState({ email: false, password: false });

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

  const emailEmptyError = (touched.email || submitted) && !email ? "Enter your email address" : "";
  const emailFormatError = (touched.email || submitted) && email && !isValidEmailFormat(email) ? "Invalid email address" : "";
  const passwordError = (touched.password || submitted) && !password ? "Enter your password" : "";

  const emailErrorMsg = (focused.email ? "" : (emailEmptyError || emailFormatError));
  const showEmailBorder = (touched.email || submitted) && (!email || (email && !isValidEmailFormat(email)));
  const showPasswordBorder = (touched.password || submitted) && !password;
  const emailInErrorFocus = focused.email && !changed.email && showEmailBorder;
  const passwordInErrorFocus = focused.password && !changed.password && showPasswordBorder;
  
  const isEmailFilled = email.length > 0 && !emailErrorMsg;
  const isPasswordFilled = password.length > 0 && !passwordError;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setChanged({ ...changed, email: true });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
    setChanged({ ...changed, password: true });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    setSubmitted(true);

    if (!email || !password) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Invalid email or password. If you don't have an account, please create one.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <style jsx>{`
        input {
          transition: box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        input:hover {
          border-color: var(--sys-outline-roles-outline);
        }
        input.email-error-focus, input.password-error-focus {
          border-color: var(--sys-error) !important;
        }
        input.filled-valid {
          border-color: var(--sys-primary) !important;
          background-color: var(--sys-primary-container) !important;
        }
        input.filled-valid:hover {
          border-color: var(--sys-primary) !important;
        }
        input.filled-valid:focus {
          border-color: var(--sys-primary) !important;
          box-shadow: 0 0 0 2px rgba(103, 58, 183, 0.15) !important;
        }
        input.email-error-focus:focus, input.password-error-focus:focus {
          box-shadow: 0 0 0 2px rgba(214, 53, 53, 0.1) !important;
        }
        input:focus {
          box-shadow: 0 0 0 2px rgba(103, 58, 183, 0.15);
        }
        input:disabled {
          box-shadow: none;
        }
        input:not(:placeholder-shown):not(:focus) {
          background-color: var(--sys-primary-container);
          color: var(--sys-on-primary-container);
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
      <h1 className="text-center mb-1 text-on-surface text-headline-medium" style={{ display: "block", marginTop: "8px", fontSize: "calc(var(--sys-typescale-headline-medium-fontsize) - 0px)" }}>
        Log in
      </h1>
      <p className="text-center text-on-surface-variant text-body-medium" style={{ display: "block", marginTop: "-14px" }}>
        Welcome back to FieldSpec
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <div className="flex justify-between items-center mb-xs">
            <label htmlFor="email" className="text-on-surface text-label-medium">
              Email <span className="text-primary">*</span>
            </label>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute pointer-events-none" style={{ color: "var(--sys-on-surface-variant)", left: "12px", fontSize: "20px" }}>
              mail
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => setFocused({ ...focused, email: true })}
              onBlur={() => { setFocused({ ...focused, email: false }); setTouched({ ...touched, email: true }); }}
              required
              placeholder=" "
              autoComplete="off"
              className={"w-full box-border px-md py-[14px] border-[1.5px] border-outline-variant rounded-sm bg-surface text-on-surface focus:outline-1 focus:outline-primary text-body-medium transition-all duration-200" + (emailEmptyError || emailFormatError ? " email-error-focus" : isEmailFilled ? " filled-valid" : "")}
              style={{ paddingLeft: "34px", borderWidth: "1.5px", ...(isEmailFilled ? { borderColor: "var(--sys-primary)", backgroundColor: "var(--sys-primary-container)", borderWidth: "2px" } : {}) }}
            />
          </div>
          {emailErrorMsg && (
            <p className="mt-xs text-body-small" style={{ color: "var(--sys-error)" }}>{emailErrorMsg}</p>
          )}
        </div>

        <div className="mb-lg">
          <div className="flex justify-between items-center mb-xs">
            <label htmlFor="password" className="text-on-surface text-label-medium">
              Password <span className="text-primary">*</span>
            </label>
            <Link href="/forgot-password" className="text-primary text-body-small no-underline hover:underline active:underline transition-all duration-200 cursor-pointer">
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute pointer-events-none" style={{ color: "var(--sys-on-surface-variant)", left: "12px", fontSize: "20px", width: "28px" }}>
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setFocused({ ...focused, password: true })}
              onBlur={() => { setFocused({ ...focused, password: false }); setTouched({ ...touched, password: true }); }}
              required
              placeholder=" "
              autoComplete="off"
              className={"w-full box-border px-md py-[14px] border-[1.5px] border-outline-variant rounded-sm bg-surface text-on-surface focus:outline-1 focus:outline-primary text-body-medium transition-all duration-200" + (passwordError ? " password-error-focus" : isPasswordFilled ? " filled-valid" : "")}
              style={{ paddingLeft: "34px", paddingRight: "32px", borderWidth: "1.5px", ...(isPasswordFilled ? { borderColor: "var(--sys-primary)", backgroundColor: "var(--sys-primary-container)", borderWidth: "2px" } : {}) }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute cursor-pointer bg-transparent border-none p-0"
              style={{ color: "var(--sys-on-surface-variant)", right: "12px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {passwordError && (
            <p className="mt-xs text-body-small" style={{ color: "var(--sys-error)" }}>{passwordError}</p>
          )}
        </div>

        {error && (
          <div className="p-md bg-error-container text-on-error-container rounded-sm mb-md text-body-small">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200 hover:bg-primary-container hover:text-on-primary-container active:translate-y-[1px] -mt-1 focus:outline-none"
          style={{ fontSize: "16px", fontWeight: 500, padding: "12px 16px" }}
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <div className="mt-sm mb-sm flex items-center">
        <div className="flex-1 h-px bg-outline"></div>
        <span className="px-sm text-on-surface-variant text-label-medium">or</span>
        <div className="flex-1 h-px bg-outline"></div>
      </div>

      <Link
        href="/api/auth/oauth/google"
        className="w-full flex items-center justify-center gap-sm px-md border border-outline rounded-sm bg-surface hover:bg-surface-variant transition-colors cursor-pointer"
        style={{ paddingTop: "10px", paddingBottom: "10px", textDecoration: "none" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-on-surface text-label-large">Continue with Google</span>
      </Link>

      <div className="mt-[20px] text-center text-on-surface-variant text-body-medium">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary no-underline hover:underline active:underline transition-all duration-200">
          Sign up
        </Link>
      </div>
    </div>
  );
}