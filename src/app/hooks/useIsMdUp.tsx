import { useState, useEffect } from "react";

export default function useIsMdUp() {
    const [isMdUp, setIsMdUp] = useState(false);

    useEffect(() => {
        // Match Tailwind’s "md" breakpoint (min-width: 768px)
        const mediaQuery = window.matchMedia("(min-width: 1143px)");

        const handleResize = () => setIsMdUp(mediaQuery.matches);
        handleResize(); // Set on mount

        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    return isMdUp;
}