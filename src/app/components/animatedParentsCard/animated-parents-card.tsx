"use client"

import { useEffect, useRef, useState } from "react";

export default function AnimatedParentsCard({ item, index }: any) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    // Optional: unobserve after animation starts
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of element is visible
                rootMargin: "0px 0px -50px 0px", // Optional: trigger slightly before element enters viewport
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300`}
            style={{
                // animationDelay: isInView ? `${index * 0.6}s` : '0s',
                animation: isInView
                    ? `fade-in-up ${index * 0.8}s ease-out`
                    : "none",
            }}
        >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">
                {item.title}
            </h3>
            <p className="text-gray-600">{item.desc}</p>
        </div>
    );
}
