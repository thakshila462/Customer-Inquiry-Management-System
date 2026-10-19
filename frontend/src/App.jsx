import { useState } from "react";
import api from "./services/api";
import AdminDashboard from "./component/AdminDashboard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check whether a login token already exists.
  const [isAuthenticated, setIsAuthenticated] = useState(
      Boolean(localStorage.getItem("ACCESS_TOKEN"))
  );

  // Login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const token = response.data.token;

      if (!token) {
        setError(
            "Login failed. No authentication token was returned."
        );
        return;
      }

      // Save JWT token.
      localStorage.setItem("ACCESS_TOKEN", token);

      setPassword("");
      setError("");

      // Navigate to the dashboard.
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response) {
        setError(
            error.response.data.message ||
            "Login failed. Please check your email and password."
        );
      } else {
        setError(
            "Cannot connect to the server. Please check whether the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    setIsAuthenticated(false);

    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  // Display dashboard after login.
  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Main layout */}
        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl lg:grid-cols-2">

          {/* Left branding section */}
          <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-10 text-white lg:flex xl:p-14">

            <div className="absolute -right-20 top-32 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute -right-10 top-40 h-44 w-44 rounded-full border border-white/10" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/5" />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold backdrop-blur">
                I
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-wide">
                  InquiryFlow
                </h1>

                <p className="text-xs text-blue-100">
                  CUSTOMER MANAGEMENT
                </p>
              </div>
            </div>

            {/* Branding content */}
            <div className="relative z-10 my-12">

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-blue-50">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              YOUR WORKSPACE, SIMPLIFIED
            </span>

              <h2 className="mt-7 text-4xl font-bold leading-tight xl:text-5xl">
                Every inquiry.
                <br />
                Every detail.
                <br />
                <span className="text-blue-200">
                Under control.
              </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-blue-100 xl:text-base">
                Manage customer conversations, track requests, and keep every
                inquiry moving towards a resolution from one organized workspace.
              </p>

              <div className="mt-9 space-y-5">

                <Feature
                    number="01"
                    title="Stay organized"
                    description="Keep customer inquiries in one place."
                />

                <Feature
                    number="02"
                    title="Track progress"
                    description="Know which requests need attention."
                />

                <Feature
                    number="03"
                    title="Resolve confidently"
                    description="Follow every inquiry through its lifecycle."
                />

              </div>
            </div>

            <p className="relative z-10 text-xs text-blue-100/70">
              A smarter way to manage customer inquiries.
            </p>
          </section>

          {/* Right login section */}
          <section className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-10 xl:px-14">

            <div className="w-full max-w-md">

              {/* Mobile branding */}
              <div className="mb-9 flex items-center gap-3 lg:hidden">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                  I
                </div>

                <div>
                  <h1 className="text-lg font-bold text-white">
                    InquiryFlow
                  </h1>

                  <p className="text-xs text-slate-400">
                    CUSTOMER MANAGEMENT
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  STAFF PORTAL
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Sign in to access your workspace and manage customer inquiries.
                </p>

              </div>

              {/* Login form */}
              <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
              >

                {/* Email input */}
                <div>

                  <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    {/* Email icon */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          strokeWidth="1.7"
                      />

                      <path
                          d="m4 7 8 6 8-6"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>

                  </span>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className="w-full rounded-xl border border-slate-600 bg-slate-800 py-3.5 pl-12 pr-4 text-sm text-white caret-blue-400 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                    />

                  </div>
                </div>

                {/* Password input */}
                <div>

                  <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <div className="relative">

                    {/* Lock icon */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <rect
                          x="4"
                          y="10"
                          width="16"
                          height="11"
                          rx="2"
                          strokeWidth="1.7"
                      />

                      <path
                          d="M8 10V7a4 4 0 0 1 8 0v3"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                      />

                      <circle
                          cx="12"
                          cy="15"
                          r="1"
                          fill="currentColor"
                      />
                    </svg>

                  </span>

                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="w-full rounded-xl border border-slate-600 bg-slate-800 py-3.5 pl-12 pr-12 text-sm text-white caret-blue-400 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                    />

                    {/* Eye icon button */}
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-400 transition hover:text-white focus:outline-none focus:text-blue-400"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        title={
                          showPassword ? "Hide password" : "Show password"
                        }
                    >

                      {showPassword ? (

                          /* Eye-off icon */
                          <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                          >
                            <path
                                d="M3 3l18 18"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.7 2.8 10 2.5 12c.4 1.1 1.4 2.7 3.3 4.2A10.6 10.6 0 0 0 12 19c1.3 0 2.5-.3 3.6-.8"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                          </svg>

                      ) : (

                          /* Eye icon */
                          <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                          >
                            <path
                                d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                strokeWidth="1.8"
                            />
                          </svg>

                      )}

                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
                    >
                      {error}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? "Signing in..." : "Sign in to workspace"}

                  {!loading && (
                      <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                      >
                        <path
                            d="M5 12h14m-6-6 6 6-6 6"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                      </svg>
                  )}

                </button>

              </form>

              {/* Security information */}
              <div className="mt-8 border-t border-slate-800 pt-6">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">

                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path
                          d="m12 3 7 3v5c0 4.5-3 7-7 10-4-3-7-5.5-7-10V6l7-3Z"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                      />

                      <path
                          d="m9 12 2 2 4-4"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      />
                    </svg>

                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Secure staff access
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      This workspace is intended for authorized staff members only.
                    </p>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-slate-500">
                © 2026 InquiryFlow. All rights reserved.
              </p>

            </div>
          </section>
        </div>
      </main>
  );
}

// Feature component
function Feature({ number, title, description }) {
  return (
      <div className="flex items-start gap-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-bold text-white">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-blue-100/80">
            {description}
          </p>
        </div>

      </div>
  );
}

export default App;