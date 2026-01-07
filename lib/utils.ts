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
