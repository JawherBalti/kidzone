"use client"
import { useEffect, useRef, useState } from 'react';

export default function AnimatedReviewsCard({ t, index }: any) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { 
                threshold: 0.1,
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
            className={`bg-white/90 rounded-2xl shadow-md p-6 max-w-sm transition-all duration-500 ease-out ${
                isInView 
                    ? 'opacity-100 translate-y-0'  // Final state
                    : 'opacity-0 translate-y-10'   // Initial state
            }`}
            style={{
                transitionDelay: isInView ? `${index * 0.2}s` : '0s'
            }}
        >
            <p className="text-gray-700 italic mb-3">
                “{t.quote}”
            </p>
            <div className="flex justify-center text-yellow-400 text-xl mb-2">
                ⭐⭐⭐⭐⭐
            </div>
            <p className="font-semibold text-gray-800">
                {t.name}
            </p>
        </div>
    );
}