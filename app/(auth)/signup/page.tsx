"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateField(field: string, value: string) {
    const errors: { name?: string; email?: string; password?: string } = {};
    
    if (field === "name" || field === "all") {
      if (!value.trim()) {
        errors.name = "This field is required";
      }
    }
    if (field === "email" || field === "all") {
      if (!value.trim()) {
        errors.email = "This field is required";
      } else if (!validateEmail(value)) {
        errors.email = "Enter a valid email address";
      }
    }
    if (field === "password" || field === "all") {
      if (!value) {
        errors.password = "This field is required";
      } else if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.password = "Please meet all password requirements";
      }
    }
    
    return errors;
  }

  function handleBlur(field: string) {
    const fieldValue = field === "name" ? name : field === "email" ? email : password;
    const errors = validateField(field, fieldValue);
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    const errors = validateField("all", "");
    if (name) errors.name = undefined;
    if (email) {
      if (!validateEmail(email)) {
        errors.email = "Enter a valid email address";
      } else {
        errors.email = undefined;
      }
    }
    if (password) errors.password = undefined;
    
    setFieldErrors(errors);
    
    const hasErrors = Object.values(errors).some(e => e);
    if (hasErrors) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <div className="text-center">
          <div 
            className="mb-md rounded-full inline-flex items-center justify-center"
            style={{ 
              width: "64px", 
              height: "64px", 
              backgroundColor: "var(--sys-primary)",
              color: "var(--sys-on-primary)",
            }}
          >
            <span className="material-icons" style={{ fontSize: "32px" }}>check</span>
          </div>
          <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
            Check Your Email
          </h1>
          <p className="text-center mb-lg text-on-surface-variant text-body-medium">
            We&apos;ve sent a verification link to your email address.
          </p>
          <Link
            href="/login"
            className="text-primary text-body-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
        Create Account
      </h1>
      <p className="text-center mb-lg text-on-surface-variant text-body-medium">
        Get started with FieldSpec
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Name <span className="text-primary">*</span>
          </label>
          <div 
            className="flex items-center border rounded-sm"
            style={{ 
              borderColor: fieldErrors.name ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              width: "352px",
              height: "37.6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.name ? "var(--sys-error)" : "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.name ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          >
            <input
              type="text"
              autoComplete="new-password"
              data-form-type="other"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              onBlur={() => handleBlur("name")}
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
              style={{ 
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-xs text-error text-label-small">{fieldErrors.name}</p>
          )}
        </div>

        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Email <span className="text-primary">*</span>
          </label>
          <div 
            className="flex items-center border rounded-sm"
            style={{ 
              borderColor: fieldErrors.email ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              width: "352px",
              height: "37.6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.email ? "var(--sys-error)" : "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.email ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          >
            <input
              type="email"
              autoComplete="new-email"
              data-form-type="other"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim() && validateEmail(e.target.value)) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              onBlur={() => handleBlur("email")}
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
              style={{ 
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-xs text-error text-label-small">{fieldErrors.email}</p>
          )}
        </div>

        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Password <span className="text-primary">*</span>
          </label>
          <div 
            className="flex items-center border rounded-sm"
            style={{ 
              borderColor: fieldErrors.password ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              width: "352px",
              height: "37.6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = fieldErrors.password ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              data-form-type="other"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => {
                setIsPasswordFocused(false);
                handleBlur("password");
              }}
              minLength={8}
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
              style={{ 
                transition: "border-color 0.2s ease",
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-sm py-sm cursor-pointer flex items-center justify-center bg-transparent border-none"
              style={{ color: fieldErrors.password ? "var(--sys-error)" : "var(--sys-outline)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--sys-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = fieldErrors.password ? "var(--sys-error)" : "var(--sys-outline)";
              }}
            >
              <span className="material-icons" style={{ fontSize: "16px" }}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-xs text-error text-label-small">{fieldErrors.password}</p>
          )}
          {isPasswordFocused && (
            <div className="mt-xs text-on-surface-variant text-label-small flex flex-col gap-1">
              {password.length < 8 && <span>• Must be at least 8 characters</span>}
              {!/[A-Z]/.test(password) && <span>• Must contain at least an uppercase letter</span>}
              {!/[0-9]/.test(password) && <span>• Must contain at least one number</span>}
              {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && <span>• Must include a special character</span>}
            </div>
          )}
        </div>

        {error && (
          <div className="p-md bg-error-container text-on-error-container rounded-sm mb-md text-body-small" style={{ width: "352px" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="p-md bg-primary text-on-primary rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 text-label-large"
          style={{ width: "352px", transition: "all 0.2s ease", border: "none", textDecoration: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--sys-primary) 85%, white)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-primary)";
          }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="my-md flex items-center">
        <div className="flex-1 h-px bg-outline" style={{ height: "0.5px" }}></div>
        <span className="px-sm text-on-surface-variant text-label-medium">or</span>
        <div className="flex-1 h-px bg-outline" style={{ height: "0.5px" }}></div>
      </div>

<button
          type="button"
          onClick={() => window.location.href = "/api/auth/oauth/google"}
          className="flex items-center justify-center gap-sm py-sm px-md border border-outline rounded-sm bg-surface"
          style={{ width: "352px", transition: "all 0.2s ease", outline: "none", boxShadow: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-surface-container)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-surface)";
          }}
        >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-on-surface text-label-large">Sign up with Google</span>
      </button>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        Already have an account?{" "}
        <Link href="/login" className="text-primary" style={{ textDecoration: "none" }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}