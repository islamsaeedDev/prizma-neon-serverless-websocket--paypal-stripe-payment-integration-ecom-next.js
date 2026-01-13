"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/authConfig";
import { signInFormScheme } from "../validator";
import { AuthError } from "next-auth";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormScheme.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        default:
          return { success: false, message: error.message };
      }
    }

    return { success: false, message: "Invalid email or password" };
  }
}

//signOut  user
export async function signOutUser() {
  await signOut();
}
