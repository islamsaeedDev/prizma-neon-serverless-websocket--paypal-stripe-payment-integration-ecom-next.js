"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/lib/actions/user.action";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signUpDefaultValues } from "@/lib/constants";

function SignUpFrom() {
  const [state, formAction, isPending] = useActionState(signUpWithCredentials, {
    success: false,
    message: [],
  });

  console.log(state);
  const searchParams = useSearchParams();
  const callbackurl = searchParams.get("callbackurl") || "/";

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackurl" value={callbackurl} />
      <div className="space-y-6">
        <div>
          <Label className="mb-3" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            // required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div>
          <Label className="mb-3" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="text"
            // required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
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
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div>
          <Label className="mb-3" htmlFor="confirmPassword">
            Confrim Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <Button disabled={isPending} className="w-full" variant="default">
            {isPending ? "Submiting..." : "Sign Up"}
          </Button>
        </div>
        {state && !state.success && state.message.length > 0 && (
          <div className="text-red-500">
            {state.message.map((m: string) => (
              <p key={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</p>
            ))}
          </div>
        )}
        <div className="text-sm text-center text-muted-foreground ">
          Aleady have an account?{"  "}
          <Link className="link underline" target="_self" href="/sign-in">
            Sign In Here
          </Link>
        </div>
      </div>
    </form>
  );
}

export default SignUpFrom;
