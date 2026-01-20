"use client";
import { EllipsisIcon, ShoppingCart } from "lucide-react";
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

const Menu = ({ userButton }: { userButton: React.ReactNode }) => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1  ">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>
        {userButton}
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
            {userButton}
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
