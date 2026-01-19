"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n/client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth"; // Import your auth hook

function NavbarContent() {
  const { t, i18n, ready } = useTranslation();
  const pathname = usePathname();
  const router = useRouter()
  const [lang, setLang] = useState("en");
  const [clientReady, setClientReady] = useState(false);
  const { user, logout, loading } = useAuth(); // Get auth state

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === "function") {
      const storedLang = localStorage.getItem("i18nextLng");
      const initialLang = storedLang || i18n.language || "en";

      if (i18n.language !== initialLang) {
        i18n.changeLanguage(initialLang);
      }

      setLang(initialLang);
    }
  }, [i18n]);

  const handleLogout = async () => {
    try {
      await logout();
      // Optional: redirect to home after logout
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!ready || !clientReady) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);

    if (i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(selectedLang);
      localStorage.setItem("i18nextLng", selectedLang);
      document.cookie = `NEXT_LOCALE=${selectedLang}; path=/;`;
    }

    if (pathname === "/" || pathname === "/en" || pathname === "/fr")
      redirect("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
        🌈 Kid<span className="text-orange-500">Zone</span>
      </h1>
      <ul className="hidden md:flex space-x-6 text-gray-600 text-lg font-bold">
        <li className="hover:text-pink-500 cursor-pointer">
          <Link href="/">{t("navbar.home")}</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
          <Link href="/learn">{t("navbar.learn")}</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
          <Link href="/games">{t("navbar.games")}</Link>
        </li>
        <li className="hover:text-pink-500 cursor-pointer">
          <Link href="/about">{t("navbar.about")}</Link>
        </li>
      </ul>

      <ul className="flex items-center space-x-6 text-gray-600 font-bold">
        <li>
          <select
            value={lang}
            onChange={handleChange}
            className="hidden md:block rounded-lg border border-blue-400 px-3 py-1 text-blue-700 bg-white font-bold"
          >
            <option value="en" className="font-bold">
              EN
            </option>
            <option value="fr" className="font-bold">
              FR
            </option>
          </select>
        </li>

        {/* Conditional rendering based on auth state */}
        {loading ? (
          // Show loading state
          <li className="text-gray-500 text-lg">Loading...</li>
        ) : user ? (
          // Show user menu when logged in
          <li className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 hidden md:block">
                Hello, {user.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 text-lg rounded-md p-1 px-3 cursor-pointer hover:bg-red-600 transition-colors"
            >
              {t("navbar.logout")}
            </button>
          </li>
        ) : (
          // Show login/register when not logged in
          <>
            <li className="text-lg rounded-md p-1 px-3 cursor-pointer border border-gray-600 hover:bg-gray-50 transition-colors">
              <Link href="/auth/login">{t("navbar.login")}</Link>
            </li>
            <li className="text-white bg-orange-500 text-lg rounded-md p-1 px-3 cursor-pointer hover:bg-orange-600 transition-colors">
              <Link href="/auth/register">{t("navbar.register")}</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export const Navbar = () => {
  return (
    <Suspense
      fallback={
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            🌈 Kid<span className="text-orange-500">Zone</span>
          </h1>
          {/* Simple language selector without i18n during loading */}
          <select className="hidden md:block rounded-lg border border-blue-400 px-3 py-1 text-blue-700 bg-white font-semibold">
            <option value="en">🇬🇧 English</option>
          </select>
        </nav>
      }
    >
      <NavbarContent />
    </Suspense>
  );
};