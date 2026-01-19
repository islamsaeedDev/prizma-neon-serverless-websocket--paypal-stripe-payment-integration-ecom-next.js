import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import { auth } from "@/authConfig";
import { redirect } from "next/navigation";
import SignUpFrom from "./signup-form";
export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackurl?: string }>;
}) => {
  const session = await auth();
  const { callbackurl } = await searchParams;

  if (session) {
    return redirect(callbackurl || "/");
  }
  return (
    <div className="w-full max-w-md mx-auto my-auto h-screen flex items-center justify-center ">
      <Card className="w-full">
        <CardHeader className="space-y-4 ">
          <Image
            className="mx-auto"
            src="/images/logo.png"
            width={100}
            height={100}
            alt={`${APP_NAME} LOGO`}
            priority={true}
          />

          <CardTitle className="text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign Up from here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* form structure  */}
          <SignUpFrom />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
