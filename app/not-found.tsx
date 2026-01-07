"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib";
import Image from "next/image";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center gap-4">
      <Image
        src="/images/logo.png"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2">The page you are looking for does not exist.</p>

        <Button
          variant="outline"
          className="mt-5 ml-2"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
