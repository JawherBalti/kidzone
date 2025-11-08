"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n/client";
import { redirect } from "next/navigation";

function NavbarContent() {
    const { t, i18n, ready } = useTranslation();
    const [lang, setLang] = useState("en"); // Set default to "en"
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        setClientReady(true);
    }, []);

    useEffect(() => {
        // Check if i18n is initialized and changeLanguage exists
        if (i18n && typeof i18n.changeLanguage === "function") {
            const storedLang = localStorage.getItem("i18nextLng");
            const initialLang = storedLang || i18n.language || "en";

            // Sync i18n with stored language
            if (i18n.language !== initialLang) {
                i18n.changeLanguage(initialLang);
            }

            setLang(initialLang);
        }
    }, [i18n]); // Add i18n as dependency

    if (!ready || !clientReady) return null;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLang = e.target.value;
        setLang(selectedLang);

        // Check if i18n is available before calling changeLanguage
        if (i18n && typeof i18n.changeLanguage === "function") {
            i18n.changeLanguage(selectedLang);
            localStorage.setItem("i18nextLng", selectedLang);
            document.cookie = `NEXT_LOCALE=${selectedLang}; path=/;`;
        }

        redirect("/")
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
                🌈 Kid<span className="text-orange-500">Zone</span>
            </h1>
            <ul className="hidden md:flex space-x-6 text-gray-600 text-lg font-bold">
                <li className="hover:text-pink-500 cursor-pointer">
                    {t("navbar.home")}
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                    {t("navbar.learn")}
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                    {t("navbar.games")}
                </li>
                <li className="hover:text-pink-500 cursor-pointer">
                    {t("navbar.about")}
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
                <li className="text-lg rounded-md p-1 px-3 cursor-pointer border border-gray-600">
                    <Link href="/auth/login">{t("navbar.login")}</Link>
                </li>
                <li className="text-white bg-orange-500 text-lg rounded-md p-1 px-3 cursor-pointer">
                    {t("navbar.register")}
                </li>
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
