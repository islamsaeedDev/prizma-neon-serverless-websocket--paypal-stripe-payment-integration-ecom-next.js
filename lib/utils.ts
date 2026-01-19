import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//convert prisma returned object to js  obejct
export function convertToPlainObjectz<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//format number with decimal places

export function formatNumberWithDecimal(num: number): string {
  const [integer, decimal] = num.toString().split(".");

  return decimal ? `${integer}.${decimal.padEnd(2, "0")}` : integer;
}

//handle zod errors
export function handleZodError(error: any) {
  if (error.name === "ZodError") {
    const fieldsError = error.issues.map((issue: any) => issue.message);
    return { success: false, message: fieldsError };
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    return { success: false, message: ["Email already exists"] };
  }

  return { success: false, message: ["Invalid email or password"] };
}

//Cart Schema
