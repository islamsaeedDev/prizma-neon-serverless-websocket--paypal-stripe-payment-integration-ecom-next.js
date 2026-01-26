"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="md:w-1/2 w-2/3 mx-auto flex flex-col items-center min-h-screen justify-center gap-4">
      <Image
        src="/images/logo.png"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className="p-6  w-full rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2">The page you are looking for does not exist.</p>

        <Button
          variant="outline"
          className="mt-5 ml-2 w-fit"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
