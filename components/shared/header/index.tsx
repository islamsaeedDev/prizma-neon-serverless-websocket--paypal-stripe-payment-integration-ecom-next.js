import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import UserButton from "./user-button";

function Header() {
  return (
    <div className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.png"
              alt={`${APP_NAME} logo`}
              width={48}
              height={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-2">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="space-x-2">
          <Menu userButton={<UserButton />} />
        </div>
      </div>
    </div>
  );
}

export default Header;
