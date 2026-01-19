"use client";

import { useAuth } from "@/app/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaBook,
  FaPuzzlePiece,
  FaGamepad,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";

export const Sidebar = () => {
  const { t, ready } = useTranslation();
  const [clientReady, setClientReady] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!ready || !clientReady) return null;

  const menuItems = [
    {
      icon: <FaHome />,
      label: t("sidebar.home"),
      color: "pink-400",
      link: "/",
    },
    {
      icon: <FaBook />,
      label: t("sidebar.learn"),
      color: "amber-400",
      link: "/learn",
    },
    {
      icon: <FaPuzzlePiece />,
      label: t("sidebar.exercice"),
      color: "green-500",
      link: "/exercice",
    },
    {
      icon: <FaGamepad />,
      label: t("sidebar.play"),
      color: "orange-500",
      link: "/play",
    },
    {
      icon: <FaUserFriends />,
      label: t("sidebar.invite"),
      color: "violet-600",
      link: "/invite",
    },
    {
      icon: <FaUser />,
      label: t("sidebar.profile"),
      color: "blue-600",
      link: "/profile",
    },
  ];

  return (
    <div className="w-full h-full bg-white/70 font-bold backdrop-blur-sm shadow-md p-6 space-y-6">
      {menuItems.filter(item => {
        if(user) return item
        else return item.label !== t("sidebar.profile") && item.label !== t("sidebar.invite")
      }).map((item, i) => (
        <Link
          key={i}
          href={item.link}
          className={`flex items-center space-x-3 text-lg cursor-pointer text-gray-800 
        ${item.color === "pink-400" && "hover:text-pink-400"}
        ${item.color === "amber-400" && "hover:text-amber-400"}
        ${item.color === "green-500" && "hover:text-green-500"}
        ${item.color === "orange-500" && "hover:text-orange-500"}
        ${item.color === "violet-600" && "hover:text-violet-600"}
        ${item.color === "blue-600" && "hover:text-blue-600"}
      `}
        >
          <span
            className={`text-xl
        ${item.color === "pink-400" && "text-pink-400"}
        ${item.color === "amber-400" && "text-amber-400"}
        ${item.color === "green-500" && "text-green-500"}
        ${item.color === "orange-500" && "text-orange-500"}
        ${item.color === "violet-600" && "text-violet-600"}
        ${item.color === "blue-600" && "text-blue-600"}
        `}
          >
            {item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
