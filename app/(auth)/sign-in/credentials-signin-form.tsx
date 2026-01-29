"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function CredentialsSignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackurl = searchParams.get("callbackurl") || "/";
  const error = searchParams.get("error");

  // Show toast when session expires
  useEffect(() => {
    if (error === "session_expired") {
      toast.error("Your session has expired. Please sign in again.");
    }
  }, [error]);

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackurl" value={callbackurl} />
      <div className="space-y-6">
        <div>
          <Label className="mb-3" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div>
          <Label className="mb-3" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div>
          <Button disabled={isPending} className="w-full" variant="default">
            {isPending ? "signing in ..." : "Sign In"}
          </Button>
        </div>
        {state && !state.success && (
          <p className="text-red-500">{state.message}</p>
        )}
        <div className="text-sm text-center text-muted-foreground ">
          Don`t have an account?{"  "}
          <Link className="link" target="_self" href="/sign-up">
            Sign Up Here
          </Link>
        </div>
      </div>
    </form>
  );
}

export default CredentialsSignInForm;
