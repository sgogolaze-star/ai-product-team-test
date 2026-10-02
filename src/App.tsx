import React, { useEffect, useRef, useState } from "react";
import "./App.css";

type FieldError = { field: string; message: string };

const ICONS = {
  logo: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="var(--primary-600)" />
      <path d="M7 12h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  sso: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--surface)" stroke="var(--stroke)" />
      <path d="M8 12h8" stroke="var(--text-900)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    try {
      mq.addEventListener("change", handler);
    } catch {
      mq.addListener(handler);
    }
    return () => {
      try {
        mq.removeEventListener("change", handler);
      } catch {
        mq.removeListener(handler);
      }
    };
  }, []);
  return reduced;
}

export default function App(): JSX.Element {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Array<{ id: string; name: string; icon?: string; redirectUrl?: string }>>([]);
  const [ssoOpen, setSsoOpen] = useState(false);
  const [ssoRedirecting, setSsoRedirecting] = useState<string | null>(null);
  const [networkToast, setNetworkToast] = useState<string | null>(null);

  const idRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();

  // Fetch SSO providers on mount
  useEffect(() => {
    let mounted = true;
    fetch("/auth/sso/providers")
      .then((r) => {
        if (!r.ok) throw new Error("no providers");
        return r.json();
      })
      .then((data) => {
        if (mounted && Array.isArray(data)) setProviders(data);
      })
      .catch(() => {
        // fallback static providers
        if (mounted)
          setProviders([
            { id: "okta", name: "Okta", redirectUrl: "/auth/sso?provider=okta" },
            { id: "azure", name: "Azure AD", redirectUrl: "/auth/sso?provider=azure" },
          ]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Focus management: if form-level errors present, move focus to summary
  useEffect(() => {
    if (formError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formError]);

  function validate(): { ok: boolean; errors: FieldError[] } {
    const errors: FieldError[] = [];
    if (!identifier.trim()) {
      errors.push({ field: "identifier", message: "Email or username is required" });
    } else if (identifier.includes("@")) {
      // basic email regex
      const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!re.test(identifier)) errors.push({ field: "identifier", message: "Enter a valid work email" });
    }
    if (!password) errors.push({ field: "password", message: "Password cannot be empty" });
    return { ok: errors.length === 0, errors };
  }

  function mapFieldErrors(list: FieldError[] | undefined) {
    if (!list) return;
    setFieldErrors(list);
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setFormError(null);
    const { ok, errors } = validate();
    setFieldErrors(errors);
    if (!ok) {
      // focus first invalid
      const first = errors[0];
      if (first?.field === "identifier") idRef.current?.focus();
      else if (first?.field === "password") pwdRef.current?.focus();
      // show summary
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    setFormError(null);
    // disable via loading state; mark aria-busy on form
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password, remember }),
      });
      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;
      if (res.ok) {
        // success: redirect
        const redirect = (data && data.redirect) || "/";
        // some servers return a token; we'll just redirect
        window.location.href = redirect;
        return;
      }
      if (res.status === 400 && data) {
        // field errors
        mapFieldErrors(data.fieldErrors);
        if (data.message) setFormError(data.message);
        else setFormError("Please check your input and try again.");
        // focus summary
        setTimeout(() => errorSummaryRef.current?.focus(), 0);
      } else if (res.status === 401) {
        setFormError("Incorrect email or password.");
        setFieldErrors([]);
      } else {
        setFormError((data && data.message) || "Unable to sign in. Please try again later.");
      }
    } catch (err) {
      setNetworkToast("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function onForgot() {
    const url = "/auth/forgot" + (identifier ? `?email=${encodeURIComponent(identifier)}` : "");
    window.location.href = url;
  }

  // SSO modal focus trap
  const ssoRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ssoOpen) return;
    const node = ssoRef.current;
    if (!node) return;
    const focusableList = node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusable = Array.from(focusableList);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        setSsoOpen(false);
      }
      if (ev.key === "Tab") {
        // if no focusable elements, keep focus on modal container
        if (focusable.length === 0) {
          ev.preventDefault();
          (node as HTMLElement).focus();
          return;
        }
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          (last as HTMLElement | undefined)?.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          (first as HTMLElement | undefined)?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // focus first focusable or the modal container
    if (first) (first as HTMLElement).focus();
    else (node as HTMLElement).focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [ssoOpen]);

  function openSso(providerId?: string) {
    if (providerId) {
      const p = providers.find((x) => x.id === providerId);
      const url = p?.redirectUrl || `/auth/sso?provider=${providerId}`;
      setSsoRedirecting(p?.name || providerId);
      // announce and redirect (short consistent delay)
      setTimeout(() => {
        window.location.href = url;
      }, 300);
      return;
    }
    setSsoOpen(true);
  }

  function onSsoSelect(p: { id: string; redirectUrl?: string; name: string }) {
    setSsoRedirecting(p.name);
    // small consistent delay to show message for screen readers
    setTimeout(() => {
      window.location.href = p.redirectUrl || `/auth/sso?provider=${p.id}`;
    }, 300);
  }

  return (
    <div className="page-root">
      <main className="container" aria-hidden={ssoOpen}>
        <div className="auth-card" role="region" aria-labelledby="signin-title">
          <header className="brand">
            <div className="logo" aria-hidden="true">{ICONS.logo}</div>
            <h1 id="signin-title" className="title">
              Sign in
            </h1>
            <p className="caption">Use work email or username</p>
          </header>

          <form
            ref={formRef}
            className="auth-form"
            onSubmit={(e) => onSubmit(e)}
            aria-busy={loading}
            noValidate
          >
            {formError && (
              <div
                ref={errorSummaryRef}
                tabIndex={-1}
                className="error-summary"
                role="alert"
                aria-live="assertive"
              >
                <p className="error-summary-title">{formError}</p>
                {fieldErrors.length > 0 && (
                  <ul>
                    {fieldErrors.slice(0, 3).map((err, i) => (
                      <li key={i}>
                        <a
                          href={`#${err.field}-field`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            if (err.field === "identifier") idRef.current?.focus();
                            else if (err.field === "password") pwdRef.current?.focus();
                          }}
                        >
                          {err.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="identifier" className="field-label">
                Email or username
              </label>
              <input
                id="identifier"
                name="identifier"
                ref={idRef}
                className={`input ${fieldErrors.some((f) => f.field === "identifier") ? "input-error" : ""}`}
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={() => {
                  // lightweight validation on blur
                  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                  if (identifier.includes("@") && !re.test(identifier)) {
                    setFieldErrors((prev) => {
                      const others = prev.filter((p) => p.field !== "identifier");
                      return [...others, { field: "identifier", message: "Enter a valid work email" }];
                    });
                  } else {
                    setFieldErrors((prev) => prev.filter((p) => p.field !== "identifier"));
                  }
                }}
                aria-invalid={fieldErrors.some((f) => f.field === "identifier")}
                aria-describedby={fieldErrors.some((f) => f.field === "identifier") ? "identifier-error" : undefined}
                disabled={loading}
                aria-disabled={loading}
              />
              <div className="helper">Use your organization email or your username.</div>
              {fieldErrors.map((f, i) =>
                f.field === "identifier" ? (
                  <div key={i} id="identifier-error" className="field-error" role="status">
                    {f.message}
                  </div>
                ) : null
              )}
            </div>

            <div className="field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="password-row">
                <input
                  id="password"
                  name="password"
                  ref={pwdRef}
                  className={`input ${fieldErrors.some((f) => f.field === "password") ? "input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={fieldErrors.some((f) => f.field === "password")}
                  aria-describedby={fieldErrors.some((f) => f.field === "password") ? "password-error" : undefined}
                  disabled={loading}
                  aria-disabled={loading}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={loading}
                  aria-disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.map((f, i) =>
                f.field === "password" ? (
                  <div key={i} id="password-error" className="field-error" role="status">
                    {f.message}
                  </div>
                ) : null
              )}
            </div>

            <div className="row-between">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  aria-checked={remember}
                  disabled={loading}
                  aria-disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-link" onClick={onForgot} disabled={loading} aria-disabled={loading}>
                Forgot password?
              </button>
            </div>

            <div className="actions">
              <button
                type="submit"
                className="primary"
                disabled={loading}
                aria-disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="btn-content">
                    <span
                      className={`spinner ${prefersReducedMotion ? "no-motion" : ""}`}
                      role="img"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Signing in…</span>
                    <span>Signing in…</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="sso-row">
              <div className="divider"><span>or</span></div>
              <div className="sso-buttons">
                <button type="button" className="sso-btn" onClick={() => openSso()} disabled={loading} aria-disabled={loading}>
                  <span className="sso-icon">{ICONS.sso}</span>
                  Sign in with SSO
                </button>
                {providers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="sso-btn outline"
                    onClick={() => openSso(p.id)}
                    disabled={loading}
                    aria-disabled={loading}
                  >
                    <span className="sso-icon" aria-hidden>
                      {ICONS.sso}
                    </span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <footer className="card-footer" aria-hidden>
            <small>© Your Company</small>
          </footer>
        </div>
      </main>

      {ssoOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="sso-title">
          <div className="modal" ref={ssoRef} tabIndex={-1}>
            <div className="modal-header">
              <h2 id="sso-title">Sign in with SSO</h2>
              <button
                className="modal-close"
                aria-label="Close SSO dialog"
                onClick={() => setSsoOpen(false)}
                disabled={loading}
                aria-disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-instruction">Choose your identity provider</p>
              <div className="modal-list">
                {providers.map((p) => (
                  <button key={p.id} className="sso-list-btn" onClick={() => onSsoSelect(p)} disabled={loading} aria-disabled={loading}>
                    <span className="sso-list-icon">{ICONS.sso}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {ssoRedirecting && (
        <div className="aria-live" aria-live="assertive">
          Redirecting to {ssoRedirecting}…
        </div>
      )}

      {networkToast && (
        <div className="toast" role="status" aria-live="polite">
          <span>{networkToast}</span>
          <button onClick={() => { setNetworkToast(null); onSubmit(); }} className="toast-retry">Retry</button>
        </div>
      )}
    </div>
  );
}
