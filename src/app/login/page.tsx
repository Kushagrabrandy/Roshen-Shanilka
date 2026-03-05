"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className={`login-card ${mounted ? "visible" : ""}`}>
      <div className="login-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h1>Welcome back</h1>
      <p className="subtitle">
        Sign in to your admin dashboard to manage content.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="login-email">Email</label>
          <div className="field-wrapper">
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="login-pw">Password</label>
          <div className="field-wrapper">
            <input
              id="login-pw"
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="login-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="login-btn">
          {!loading && <span className="btn-shimmer" />}
          {loading ? (
            <><span className="login-spinner" />Signing in...</>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="login-footer">
        <a href="/">← Back to portfolio</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #05071a;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
        }

        .login-bg-orb--1 {
          width: 500px;
          height: 500px;
          background: #6c63ff;
          top: -150px;
          right: -100px;
          animation: orbFloat1 8s ease-in-out infinite;
        }

        .login-bg-orb--2 {
          width: 400px;
          height: 400px;
          background: #3ecfcf;
          bottom: -100px;
          left: -100px;
          animation: orbFloat2 10s ease-in-out infinite;
        }

        .login-bg-orb--3 {
          width: 250px;
          height: 250px;
          background: #ff6584;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.15;
          animation: orbFloat3 12s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }

        .login-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(108, 99, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108, 99, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          margin: 0 20px;
          padding: 44px 36px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.4, 0, .2, 1);
        }

        .login-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .login-logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #6c63ff, #3ecfcf);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(108, 99, 255, 0.3);
        }

        .login-logo svg {
          width: 26px;
          height: 26px;
          color: white;
        }

        .login-card h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .login-card .subtitle {
          font-size: 0.9rem;
          color: #8892a4;
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #a0aec0;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .field-wrapper {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #4a5568;
          width: 18px;
          height: 18px;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .login-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 0.92rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .login-input::placeholder {
          color: #4a5568;
        }

        .login-input:focus {
          border-color: rgba(108, 99, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
          background: rgba(0, 0, 0, 0.45);
        }

        .login-input:focus ~ .field-icon {
          color: #6c63ff;
        }

        .pw-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4a5568;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.2s ease;
        }

        .pw-toggle:hover {
          color: #8892a4;
        }

        .pw-toggle svg {
          width: 18px;
          height: 18px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          margin-bottom: 20px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #fca5a5;
          font-size: 0.85rem;
          animation: shakeX 0.4s ease;
        }

        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .login-error svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6c63ff, #3ecfcf);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          box-shadow: 0 4px 20px rgba(108, 99, 255, 0.3);
          margin-top: 8px;
        }

        .login-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(108, 99, 255, 0.5);
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 2.5s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .login-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.82rem;
          color: #4a5568;
        }

        .login-footer a {
          color: #6c63ff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .login-footer a:hover {
          color: #8b83ff;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
            border-radius: 20px;
          }
        }
      `}</style>
      <main className="login-page">
        <div className="login-bg-orb login-bg-orb--1" />
        <div className="login-bg-orb login-bg-orb--2" />
        <div className="login-bg-orb login-bg-orb--3" />
        <div className="login-grid-bg" />

        <Suspense fallback={<div className="login-card visible"><div className="login-spinner"></div></div>}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}

