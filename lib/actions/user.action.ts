"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/authConfig";
import { signInFormScheme, signUpFormSchema } from "../validator";
import { AuthError } from "next-auth";
import { hashSync } from "bcryptjs";
import { prisma } from "../prisma.node";
import { handleZodAndOtherError } from "../utils";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
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

//signUp  user

export async function signUpWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: ["User signed up successfully"] };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return handleZodAndOtherError(error);
  }
}
