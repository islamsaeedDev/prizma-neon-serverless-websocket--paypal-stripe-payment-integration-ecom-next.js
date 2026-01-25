"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn, signOut } from "@/authConfig";
import {
  shippingAddressScheme,
  signInFormScheme,
  signUpFormSchema,
} from "../validator";
import { AuthError } from "next-auth";
import { hashSync } from "bcryptjs";
import { prisma } from "../prisma.node";
import { handleZodAndOtherError } from "../utils";
import { ShippingAddress } from "@/types";

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

//get user by the ID
export async function getUserById(userid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userid,
      },
    });
    return user;
  } catch (error) {
    return handleZodAndOtherError(error);
  }
}

//insert user address which i get from the form  into  the user db json filed :)

export async function insertUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session) return { success: false, message: "Session not found" };

    //get userfrom session
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "User not found" };

    // confirm the user  is present in my  table
    const userFromDb = await getUserById(userId);
    if (!userFromDb) return { success: false, message: "User not found" };

    // updating  my table  filed of  address
    const address = shippingAddressScheme.parse(data);
    await prisma.user.update({
      where: { id: userId },
      data: { address: address },
    });

    return { success: true, message: ["User address inserted successfully"] };
  } catch (error) {
    return { success: false, message: handleZodAndOtherError(error) };
  }
}
