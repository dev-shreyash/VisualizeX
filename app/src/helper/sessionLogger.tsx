// components/SessionLogger.tsx
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const SessionLogger = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("Session data:", session);
    }
  }, [session, status]);

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "authenticated" && <p>User is authenticated</p>}
      {status === "unauthenticated" && <p>User is not authenticated</p>}
    </div>
  );
};

export default SessionLogger;
