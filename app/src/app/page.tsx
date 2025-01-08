
"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center text-7xl justify-between p-24 text-white bg-[#1f1f1f]">
     This is home page

     <span className="lowercase underline">
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
