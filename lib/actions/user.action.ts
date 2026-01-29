"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn, signOut } from "@/authConfig";
import {
  paymentMethodScheme,
  shippingAddressScheme,
  signInFormScheme,
  signUpFormSchema,
} from "../validator";
import { AuthError } from "next-auth";
import { hashSync } from "bcryptjs";
import { prisma } from "../prisma.node";
import { handleZodAndOtherError } from "../utils";
import { ShippingAddress } from "@/types";
import z from "zod";

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
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // If user not found in DB, session is invalid -i will sign out the uaer to  remove the fuckin old  session
    if (!user) {
      await signOut({ redirectTo: "/sign-in?error=session_expired" });
    }

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

    // confirm the user  is present in my  table (getUserById handles signOut if not found)
    const user = await getUserById(userId);
    if (!user) return { success: false, message: "User not found" };

    // updating  my table  filed of  address
    const address = shippingAddressScheme.parse(data);

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { address: address },
    });

    if (!updateUser) {
      await signOut({ redirectTo: "/sign-in?error=session_expired" });
    }

    return { success: true, message: ["User address inserted successfully"] };
  } catch (error) {
    return { success: false, message: handleZodAndOtherError(error) };
  }
}

//update use payment method in my User table

export async function updatePaymentMethod(
  data: z.infer<typeof paymentMethodScheme>,
) {
  try {
    //get session
    const session = await auth();

    //get current user
    const currentuser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });
    if (!currentuser) throw new Error("User not found");

    //updating payment method
    const paymentMethod = paymentMethodScheme.parse(data);
    await prisma.user.update({
      where: { id: currentuser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: ["User payment method inserted successfully"],
    };
  } catch (error) {
    return { success: false, message: handleZodAndOtherError(error) };
  }
}
