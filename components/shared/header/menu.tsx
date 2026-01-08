"use client";
import { EllipsisIcon, ShoppingCart, SquareUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import dynamic from "next/dynamic";

const ModeToggle = dynamic(() => import("./mode-toggle"), {
  ssr: false,
});

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/auth">
            <SquareUser />
            Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisIcon />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-3">
            <SheetTitle>Menu</SheetTitle>

            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart />
                Cart
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth">
                <SquareUser />
                Sign In
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
