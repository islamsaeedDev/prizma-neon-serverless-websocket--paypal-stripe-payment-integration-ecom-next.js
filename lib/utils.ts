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
//currency_formatter

const currency_formatter = new Intl.NumberFormat("en-us", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});
// format currency  function with  thr innternational  formatter

export function currencyFormat(amount: number | string | null) {
  if (typeof amount === "number") return currency_formatter.format(amount);
  if (typeof amount === "string")
    return currency_formatter.format(Number(amount));
  if (typeof amount === null) return "NAN";
}

// i want to  format the id like ordeId  i will show  only the  last  6 numbers by  slice  with negative -6  or  substring with length -6

export function formatId(id: string) {
  //return id.slice(-6);
  return `...${id.substring(id.length - 6)}`;
}

//format the data and time international dateTiemeFormate

export const formatDateTime = (date: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    weekday: "short",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const formattedDateTime = new Date(date).toLocaleString(
    "en-US",
    dateTimeOptions,
  );

  const formattedDate = new Date(date).toLocaleString("en-US", dateOptions);

  const formattedTime = new Date(date).toLocaleString("en-US", timeOptions);

  return {
    formattedDateTime,
    formattedDate,
    formattedTime,
  };
};
