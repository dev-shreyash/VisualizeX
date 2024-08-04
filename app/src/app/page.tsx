
"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     This is home page

     <span>
      Shreyash
     </span>
     <Button
            className="mb-2"
            onClick={() => (router.replace(`/dashboard`))}
          >
            Go to Dashboard
      </Button>
    </main>
  );
}
