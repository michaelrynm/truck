import { format, parseISO } from "date-fns";

export const formatDate = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "MMM dd, yyyy");
  } catch {
    return "";
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    return format(parsedDate, "MMM dd, yyyy HH:mm");
  } catch {
    return "";
  }
};

export const formatTime = (time: string): string => {
  return time;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};
