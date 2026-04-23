"use client";

// ─── 1. REACT HOOKS ───────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── 2. TYPES ─────────────────────────────────────────────────────────────────
// Describes the shape of the form's field values
interface FormFields {
  name: string;
  email: string;
  password: string;
}

// Describes the shape of the validation errors object (same keys, all strings)
type FormErrors = Partial<Record<keyof FormFields, string>>;

// ─── 3. CONSTANTS ─────────────────────────────────────────────────────────────
// Key used to read/write draft data in localStorage
const LS_DRAFT_KEY = "fieldspec_signup_draft";

// Regex for basic email format check (RFC-5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each rule has a label shown to the user and a test function that returns true when met
const PASSWORD_RULES: { id: string; label: string; test: (pw: string) => boolean }[] = [
  { id: "len",     label: "At least 8 characters",          test: (pw) => pw.length >= 8 },
  { id: "upper",   label: "At least one uppercase letter",   test: (pw) => /[A-Z]/.test(pw) },
  { id: "number",  label: "At least one number",             test: (pw) => /\d/.test(pw) },
  { id: "special", label: "At least one special character",  test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

// ─── 4. PURE VALIDATION FUNCTION ──────────────────────────────────────────────
/**
 * validateFields()
 * Accepts the current field values and returns an errors object.
 * If a field is valid, its key is absent from the returned object.
 * This keeps validation logic completely separate from UI code.
 */
function validateFields(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  // Name: required, must be at least 2 characters
  if (!fields.name.trim()) {
    errors.name = "Full name is required.";
  } else if (fields.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // Email: required and must match email pattern
  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Password: required, min 8 chars, must have a number, must have a special char
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/\d/.test(fields.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) {
    errors.password = "Password must contain at least one special character.";
  }

  return errors;
}

// ─── 5. COMPONENT ─────────────────────────────────────────────────────────────
export default function SignupPage() {

  // ── 5a. CONTROLLED COMPONENT STATE ──────────────────────────────────────────
  // Each field is a separate piece of state. React "controls" the input's value,
  // so the DOM always reflects what's in state — never the reverse.
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
  });

  // ── 5b. UI / FEEDBACK STATE ─────────────────────────────────────────────────
  const [errors, setErrors]           = useState<FormErrors>({});       // per-field error messages
  const [touched, setTouched]         = useState<Partial<Record<keyof FormFields, boolean>>>({}); // which fields user has visited
  const [showPassword, setShowPassword]           = useState(false); // toggle password visibility
  const [serverError, setServerError] = useState("");   // error returned from the API
  const [success, setSuccess]         = useState(false); // did signup succeed?
  const [loading, setLoading]         = useState(false); // is a network request in flight?

  // ── 5c. LOCAL STORAGE — RESTORE DRAFT ON MOUNT ──────────────────────────────
  // useEffect with [] runs once after the component first renders (mount).
  // We read any previously saved draft from localStorage and pre-fill the fields.
  // Passwords are intentionally NOT restored for security reasons.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<FormFields>;
        setFields((prev) => ({
          ...prev,
          name:  draft.name  ?? prev.name,
          email: draft.email ?? prev.email,
          // password fields are never restored
        }));
      }
    } catch {
      // If JSON.parse fails or localStorage is blocked, fail silently
    }
  }, []); // empty array = run only on mount

  // ── 5d. LOCAL STORAGE — SAVE DRAFT ON EVERY CHANGE ─────────────────────────
  // useEffect with [fields] runs whenever the `fields` state object changes.
  // We persist name & email (not passwords) so the user doesn't lose their input
  // if they navigate away and come back.
  useEffect(() => {
    try {
      const draft = { name: fields.name, email: fields.email };
      localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Graceful degradation if localStorage is unavailable
    }
  }, [fields]); // re-runs whenever fields changes

  // ── 5e. UNIVERSAL CHANGE HANDLER ────────────────────────────────────────────
  // A single handler for all inputs. It reads the field name from the input's
  // `name` attribute so we don't need four separate setXxx functions.
  // useCallback memoizes the function so it doesn't re-create on every render.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFields((prev) => ({ ...prev, [name]: value }));

      // Live re-validation: if a field has been touched (blurred) before,
      // re-validate it with the new value so errors update in real time.
      setErrors((prevErrors) => {
        if (touched[name as keyof FormFields]) {
          const nextFields = { ...fields, [name]: value };
          const newErrors  = validateFields(nextFields);
          return { ...prevErrors, [name]: newErrors[name as keyof FormFields] };
        }
        return prevErrors;
      });
    },
    [fields, touched]
  );

  // ── 5f. BLUR HANDLER ────────────────────────────────────────────────────────
  // When a user leaves a field (onBlur), we mark it as "touched" and validate it.
  // This way we only show errors after the user has interacted with a field,
  // not immediately when the page loads.
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const newErrors = validateFields(fields);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormFields] }));
    },
    [fields]
  );

  // ── 5g. SUBMIT HANDLER ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent the browser from reloading the page

    // Mark all fields touched so all errors become visible on submit
    setTouched({ name: true, email: true, password: true });

    // Run full validation before sending to server
    const validationErrors = validateFields(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop here — don't call the API with invalid data
    }

    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     fields.name,
          email:    fields.email,
          password: fields.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error?.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // ── Clear the localStorage draft after successful signup
      localStorage.removeItem(LS_DRAFT_KEY);

      setSuccess(true);
      setLoading(false);
    } catch {
      setServerError("A network error occurred. Please try again.");
      setLoading(false);
    }
  }

  // ── 5h. SUCCESS SCREEN ─ (see JSX below)

  // ── 5i. SUCCESS SCREEN ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="w-full max-w-[440px] p-lg bg-[var(--ref-primary-primary98)] rounded-md text-center">
        <div className="text-[48px] mb-md text-primary">✉</div>
        <h1 className="text-on-surface mb-xs text-title-medium">Check Your Email</h1>
        <p className="text-on-surface-variant mb-lg text-body-medium">
          We&apos;ve sent a verification link to <strong>{fields.email}</strong>.
        </p>
        <Link
          href="/login"
          className="inline-block px-lg py-md bg-primary text-on-primary no-underline rounded-sm text-label-large"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  // ── 5j. FORM RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-[440px] p-lg bg-[var(--ref-primary-primary98)] rounded-md">
      <h1 className="text-center text-on-surface text-title-small" style={{ fontSize: "var(--sys-typescale-title-small-fontsize)", lineHeight: "var(--sys-typescale-title-small-lineheight)", fontWeight: 500, letterSpacing: "var(--sys-typescale-title-small-letterspacing)", marginBottom: "1.5px" }}>Create Account</h1>
      <p className="text-center text-on-surface-variant text-body-medium" style={{ marginBottom: "1rem" }}>
        Get started with FieldSpec
      </p>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── FULL NAME FIELD ── */}
        <div className="mb-md">
          <label htmlFor="name" className="block mb-xs text-on-surface text-label-medium">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={fields.name}           /* controlled: value from state */
            onChange={handleChange}        /* update state on every keystroke */
            onBlur={handleBlur}            /* validate when focus leaves the field */
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className={`w-full box-border px-md py-sm border rounded-sm bg-surface text-on-surface text-body-medium focus:outline-none focus:ring-2 hover:bg-[var(--ref-primary-primary95)] transition-colors duration-200 ${
              touched.name && errors.name
                ? "border-error focus:ring-error"
                : "border-outline focus:ring-primary"
            }`}
          />
          {touched.name && errors.name && (
            <p id="name-error" role="alert" className="mt-xs text-body-small" style={{ color: "var(--color-error, #ef4444)" }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* ── EMAIL FIELD ── */}
        <div className="mb-md">
          <label htmlFor="email" className="block mb-xs text-on-surface text-label-medium">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            className={`w-full box-border px-md py-sm border rounded-sm bg-surface text-on-surface text-body-medium focus:outline-none focus:ring-2 hover:bg-[var(--ref-primary-primary95)] transition-colors duration-200 ${
              touched.email && errors.email
                ? "border-error focus:ring-error"
                : "border-outline focus:ring-primary"
            }`}
          />
          {touched.email && errors.email && (
            <p id="email-error" role="alert" className="mt-xs text-body-small" style={{ color: "var(--color-error, #ef4444)" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* ── PASSWORD FIELD ── */}
        <div className="mb-xs">
          <label htmlFor="password" className="block mb-xs text-on-surface text-label-medium">
            Password <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={fields.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-describedby="password-strength password-error"
              aria-invalid={!!errors.password}
              className={`w-full box-border px-md py-sm border rounded-sm bg-surface text-on-surface text-body-medium focus:outline-none focus:ring-2 hover:bg-[var(--ref-primary-primary95)] transition-colors duration-200 ${
                touched.password && errors.password
                  ? "border-error focus:ring-error"
                  : "border-outline focus:ring-primary"
              }`}
              style={{ paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute", right: "0.75rem", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", color: "inherit", padding: 0,
                display: "flex", alignItems: "center",
              }}
            >
              {showPassword ? (
                /* Eye-Off: password is visible, click to hide */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                /* Eye: password is hidden, click to show */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* ── PASSWORD REQUIREMENTS CHECKLIST ──
               Each rule is always rendered but collapses + fades out
               as soon as the user meets it, so they get live feedback. */}
          <ul
            id="password-requirements"
            aria-live="polite"
            aria-label="Password requirements"
            style={{
              listStyle: "none",
              margin: "0.5rem 0 0",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.15rem",
            }}
          >
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(fields.password);
              return (
                <li
                  key={rule.id}
                  style={{
                    // When met: collapse height to 0 and fade out
                    maxHeight:   met ? "0px" : "2rem",
                    opacity:     met ? 0       : 1,
                    overflow:    "hidden",
                    // Smooth transition for both properties
                    transition:  "max-height 0.35s ease, opacity 0.3s ease",
                    display:     "flex",
                    alignItems:  "center",
                    gap:         "0.4rem",
                    fontSize:    "0.75rem",
                    color:       "#6b7280",  // neutral grey while unmet
                  }}
                  aria-hidden={met}  // hide from screen readers once satisfied
                >
                  {/* Bullet dot */}
                  <span
                    style={{
                      width:        6,
                      height:       6,
                      borderRadius: "50%",
                      flexShrink:   0,
                      background:   "#9ca3af",
                    }}
                  />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── SERVER / API ERROR ── */}
        {serverError && (
          <div role="alert" className="p-md bg-error-container text-on-error-container rounded-sm mb-md text-body-small">
            {serverError}
          </div>
        )}

        {/* ── SUBMIT BUTTON ── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-md bg-primary text-on-primary rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 text-label-large border-none outline-none focus:outline-none ring-0 focus:ring-0 active:outline-none hover:bg-[var(--ref-primary-primary95)] hover:text-primary transition-colors duration-200"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
