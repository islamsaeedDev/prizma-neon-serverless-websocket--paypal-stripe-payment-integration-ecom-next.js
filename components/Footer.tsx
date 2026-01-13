import { APP_NAME } from "@/lib/constants";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="border-t">
      <div className="p-5 flex-center">
        <p className="text-center">
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
