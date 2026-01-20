"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavigatorLink({ href, children }: { href: string; children: string }) {
  const pathName = usePathname();

  const isActive = pathName === href;
  return (
    <Link
      href={href}
      className={cn(
        `link hover:text-pink-500 transition-colors duration-300`,
        isActive ? "text-pink-500 font-bold" : "text-priamry",
      )}
    >
      {children}
    </Link>
  );
}

export default NavigatorLink;
