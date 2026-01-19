// components/withAuth.tsx
"use client";

import { ComponentType, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../app/hooks/useAuth";

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo = "/auth/login"
) {
  return function WithAuthComponent(props: P) {
    const [isAuthorized, setIsAuthorized] = useState(false);

    const { user, loading, isSessionExpired } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const redirect = pathname.replace("/", "");

    useEffect(() => {
      if (!loading && isSessionExpired) router.push(`${redirectTo}?page=${redirect}`);
      if (!loading) {
        if (user) {
          setIsAuthorized(true);
        } else {
          router.push(`${redirectTo}?page=${redirect}`);
        }
      }
    }, [user, loading, router]);

    if (loading || !isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">
              Loading...
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} loading={loading} />;
  };
}
