import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

//format error
export function handleZodAndOtherError(error: any): string {
  if (error.name === "ZodError") {
    const fieldErrors = error.issues.map((issue: any) => issue.message);
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    return "Field already exists";
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

//Round number  to 2 decimal palces
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is not a number or string");
  }
}
