"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Adjust path as needed
import { useApi } from "../../hooks/useApi";
import { LessonProgress, progressService } from "@/lib/progressService";

interface Category {
  _id: string;
  key: string;
  color: string;
  icon: string;
  accessibleWithoutAuth: boolean;
  totalCompletions: number;
}

export default function LearnPage() {
  const { t, i18n, ready } = useTranslation();
  const [clientReady, setClientReady] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);

  const { user, loading } = useAuth();
  const { apiFetch } = useApi();

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // setLoading(true);
        const response = await progressService.getAllProgress();
        if (response.success && response.progress) {
          console.log(response.progress);
          setProgress(response.progress);
        }
      } catch (error: any) {
        // if (error.message === "SESSION_EXPIRED") {
        //   // Use the auth context to handle session expiry
        //   if (handleSessionExpired) {
        //     handleSessionExpired();
        //   } else {
        //     // Fallback: redirect to login
        //     router.push("/auth/login");
        //   }
        // }
        console.log(error);
      } finally {
        // setLoading(false);
      }
    };

    if (!loading && user) fetchProgress();
  }, [loading, user]);

  useEffect(() => {
    const loadData = async () => {
      const response = await apiFetch("/lessons");
      const data = await response.json();
      setCategories(data.lessons);
    };

    loadData();
  }, []);

  if (!ready || !clientReady || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  const isAccessible = (
    categoryKey: string,
    accessibleWithoutAuth: boolean
  ) => {
    // Always accessible if it's in the first 3 (accessibleWithoutAuth is true)
    if (accessibleWithoutAuth) return true;
    // Otherwise, only accessible if user is logged in
    return !!user;
  };

  const getCategoryLink = (
    categoryKey: string,
    accessibleWithoutAuth: boolean
  ) => {
    if (isAccessible(categoryKey, accessibleWithoutAuth)) {
      return `/learn/${categoryKey}`;
    } else {
      return `/auth/login?page=learn/${categoryKey}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-pink-100 py-8 px-4 md:px-8">
      {/* Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-6xl font-extrabold text-pink-600 mb-8"
      >
        {t("learn.title")}
      </motion.h1>

      <p className="text-center text-lg md:text-2xl text-gray-700 mb-12 font-semibold">
        {t("learn.subtitle")}
      </p>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {categories.map((cat, index) => {
          const accessible = isAccessible(cat.key, cat.accessibleWithoutAuth);
          const currentProgress = progress.find((p) => p.lessonKey === cat.key);
          const completedPhases = (currentProgress?.lastPhaseIndex ?? -1) + 1;
          const total = currentProgress?.totalPhases ?? 1;
          const lessonProgress = Math.min(
            Math.round((completedPhases / total) * 100),
            100
          );

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: accessible ? 1.05 : 1,
                rotate: accessible ? 1 : 0,
              }}
              whileTap={{ scale: accessible ? 0.95 : 1 }}
              className={`
                ${cat.color} 
                relative w-72 h-72 rounded-3xl shadow-xl 
                flex flex-col justify-center items-center p-6 
                ${accessible ? "cursor-pointer hover:shadow-2xl" : "opacity-90"}
                transition-all duration-200
              `}
            >
              {/* Lock overlay for inaccessible categories */}
              {!accessible && (
                <Link
                  href={getCategoryLink(cat.key, cat.accessibleWithoutAuth)}
                  className="absolute w-full h-full flex flex-col items-center"
                >
                  <div className="absolute inset-0 bg-black/30 rounded-3xl z-40" />
                  <div className="absolute z-40 top-4 right-4">
                    <div className="bg-yellow-500 text-white rounded-full p-3 shadow-lg">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              )}

              {user && accessible && (
                <Link
                  href={getCategoryLink(cat.key, cat.accessibleWithoutAuth)}
                  className="absolute inset-0 flex flex-col items-center justify-center group"
                >
                  <div className="absolute top-3 right-3 z-40">
                    <div
                      className="
        relative
        bg-white/80 dark:bg-gray-900/95
        backdrop-blur-md
        p-1 rounded-xl
        font-semibold shadow-xl
        border border-gray-200/80 dark:border-gray-700/80
        group-hover:shadow-2xl transition-all duration-300
        group-hover:scale-105 group-hover:-translate-y-0.5
        min-w-[140px]
        overflow-hidden
      "
                    >
                      {/* Animated background highlight */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ width: `${lessonProgress}%` }}
                      />

                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-400/30 rounded-tl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-yellow-400/30 rounded-br-xl"></div>

                      <div className="relative">
                        {/* Header with icon */}
                        {/* Phase counter */}
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              lessonProgress === 0
                                ? "bg-blue-200 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
                                : lessonProgress < 100
                                ? "bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                : "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            }`}
                          >
                            {lessonProgress === 0
                              ? t("learn.statusNotStarted")
                              : lessonProgress < 100
                              ? t("learn.statusInProgress")
                              : t("learn.statusCompleted")}
                          </span>
                        </div>

                        {/* Progress bar with percentage */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex-1">
                              <div className="h-2.5 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-700 ease-out"
                                  style={{ width: `${lessonProgress}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-800 dark:text-white bg-gray-300 dark:bg-gray-800/50 p-1 rounded-lg">
                              {lessonProgress}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {!accessible && (
                <div className="absolute mt-[0%] z-40">
                  <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-lg font-bold ">
                    {t("learn.locked")}
                  </span>
                </div>
              )}

              <Link
                href={getCategoryLink(cat.key, cat.accessibleWithoutAuth)}
                className="absolute w-full h-full flex flex-col items-center"
              >
                <div className="z-20">
                  <Image
                    src={cat.icon}
                    alt={cat.key}
                    fill
                    className="object-fill drop-shadow-lg rounded-3xl"
                  />
                </div>

                <h2 className="outline-text mt-[85%] z-30 text-2xl md:text-3xl font-bold text-black">
                  {t(`learn.${cat.key}`)}
                </h2>
              </Link>

              {/* Star indicator for accessible categories when logged in */}
              {/* {accessible && user && (
                <div className="absolute -top-2 -right-2 z-50">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              )} */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
