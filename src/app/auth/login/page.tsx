"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MonkeyAvatar from "../../../components/MonkeyAvatar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [focusField, setFocusField] = useState("welcome");
  const [formLoading, setFormLoading] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const { login, user, loading } = useAuth();
  const router = useRouter();
  const queryParam = useSearchParams();

  // Validation rules
  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    password: {
      required: true,
      minLength: 6,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      message:
        "Password must be at least 8 characters with letters and numbers and symbols",
    },
  };

  // Only check auth after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setCheckedAuth(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Only redirect if user exists AND we've checked auth
  useEffect(() => {
    const page = queryParam.get("page");

    if (checkedAuth && user && !loading && page) {
      router.push(`/${page}`);
    } else if (checkedAuth && user && !loading && !page) {
      router.push("/");
    }
  }, [user, loading, checkedAuth, router]);

  const handleChange = (e: any) => {
    setFormError("");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate on change if field has been touched
    // if (touchedFields[name as keyof typeof touchedFields]) {
    //   validateField(name, value);
    // }
    validateField(name, value);
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    const rules: any = validationRules[name as keyof typeof validationRules];
    let error = "";

    if (rules.required && !value.trim()) {
      error = rules.message;
    } else if (rules.minLength && value.length < rules.minLength) {
      error = rules.message;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    }

    setErrors({
      ...errors,
      [name]: error,
    });

    return !error;
  };

  const validateForm = () => {
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof typeof formData;
      const value = formData[fieldName];
      const fieldValid = validateField(fieldName, value);

      if (!fieldValid) {
        isValid = false;
      }

      // Ensure field is marked as touched for UI
      setTouchedFields((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    });

    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      setFormError("Please fix the errors in the form");
      return;
    }

    setFormLoading(true);

    try {
      await login(formData);
      // if (page) router.push(`/${page}`);
      // else router.push("/");
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const getMonkeyMessage = () => {
    // First, show validation errors in the monkey bubble
    if (focusField && errors[focusField as keyof typeof errors]) {
      return errors[focusField as keyof typeof errors];
    }

    // If form has general error
    if (formError) {
      return formError;
    }

    // Otherwise show friendly messages
    if (focusField === "email") {
      return "I'll keep your email safe!";
    } else if (focusField === "password") {
      return "My eyes are closed, promise!";
    } else if (focusField === "welcome") {
      return "Welcome back! Ready to play?";
    }
  };

  const getMonkeyBubbleColor = () => {
    if (focusField && errors[focusField as keyof typeof errors]) {
      return "from-red-100 via-orange-100 to-yellow-100 border-red-300";
    }
    if (formError) {
      return "from-red-100 via-orange-100 to-yellow-100 border-red-300";
    }
    return "from-green-100 via-yellow-100 to-blue-100 border-green-300";
  };

  const getMonkeyTextColor = () => {
    if (focusField && errors[focusField as keyof typeof errors]) {
      return "from-red-700 to-orange-700";
    }
    if (formError) {
      return "from-red-700 to-orange-700";
    }
    return "from-green-700 to-blue-700";
  };

  const getMonkeyPointerColor = () => {
    if (focusField && errors[focusField as keyof typeof errors]) {
      return "from-red-100 via-orange-100 to-yellow-100 border-t-3 border-l-3 border-red-300";
    }
    if (formError) {
      return "from-red-100 via-orange-100 to-yellow-100 border-t-3 border-l-3 border-red-300";
    }
    return "from-green-100 via-yellow-100 to-blue-100 border-t-3 border-l-3 border-green-300";
  };

  // Show loading while auth is checking
  if (loading || !checkedAuth) {
    return (
      <div className=" w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // User exists but shouldn't be on login page
  if (user) {
    return (
      <div className=" w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-white/70 p-5 rounded-2xl border border-gray-200 flex items-center justify-center">
      <div className="w-full ">
        {/* Increased width */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          {/* Left side - Monkey Avatar */}
          <div className="lg:w-2/5 relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full flex flex-col">
              <h2 className="text-3xl font-bold text-center">
                Welcome to<span className="text-blue-600"> Kid</span>
                <span className="text-orange-500">Zone</span>
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <MonkeyAvatar
                  focusField={focusField}
                  hasError={
                    !!(focusField && errors[focusField as keyof typeof errors])
                  }
                />
              </div>

              <div className="absolute bottom-5 w-full max-w-xs animate-fadeIn">
                {/* Speech bubble with dynamic colors based on error state */}
                <div
                  className={`bg-gradient-to-r ${getMonkeyBubbleColor()} border-3 rounded-2xl p-4 shadow-xl ${
                    (focusField && errors[focusField as keyof typeof errors]) ||
                    formError
                      ? "animate-shake"
                      : "animate-bounce-subtle"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {/* Error icon for error states */}
                    {(focusField &&
                      errors[focusField as keyof typeof errors]) ||
                    formError ? (
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    ) : null}

                    {/* Main message */}
                    <div className="text-center">
                      <p
                        className={`text-base font-extrabold bg-gradient-to-r ${getMonkeyTextColor()} bg-clip-text text-transparent`}
                      >
                        {getMonkeyMessage()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Colorful speech bubble pointer */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-6 h-6 ${getMonkeyPointerColor()} rotate-45 rounded-tl`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-transparent focus:outline-none transition-colors duration-200 ${
                        touchedFields.email && errors.email
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-300 bg-gray-50 focus:border-blue-500"
                      }`}
                      placeholder="Enter your email"
                      onFocus={() => setFocusField("email")}
                      onBlur={(e) => {
                        setFocusField("welcome");
                        handleBlur(e);
                      }}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-transparent focus:outline-none transition-colors duration-200 ${
                        touchedFields.password && errors.password
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-300 bg-gray-50 focus:border-blue-500"
                      }`}
                      placeholder="Enter your password"
                      onFocus={() => setFocusField("password")}
                      onBlur={(e) => {
                        setFocusField("welcome");
                        handleBlur(e);
                      }}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Remember Me - Optional */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me on this device
                  </label>
                </div>

                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-orange-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {formLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-1 bg-white text-gray-500">
                      New to KidZone?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div>
                  <Link
                    href="/auth/register"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Create New Account
                  </Link>
                </div>
              </form>

              {/* Footer links */}
              <div className="mt-5 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
