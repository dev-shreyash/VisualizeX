import { useSession } from 'next-auth/react';

export const useSessionData = () => {
  const { data: session, status } = useSession();
  return { session, status };
};
