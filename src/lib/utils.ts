import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  // if (error.code==='P1001') {
  //   console.error("🔌 Cannot connect to database (P1001):", error.message);
  // }
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatFloat = (number: number) => {
  return number?.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export function buildDateFilter(
  period: string,
  now: Date,
  startDate?: Date,
  endDate?: Date
): { gte: Date; lte: Date } {
  switch (period) {
    case "custom":
      if (startDate && endDate) {
        return {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        };
      }
      if (startDate && !endDate) {
        return {
          gte: startOfDay(startDate),
          lte: now,
        };
      }
      throw new Error("Start date is required for custom period");

    case "today":
      return {
        gte: startOfDay(now),
        lte: endOfDay(now),
      };

    case "week":
      return {
        gte: startOfWeek(now, { weekStartsOn: 1 }),
        lte: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case "month":
    default:
      return {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      };
  }
}
export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
export const getQualityColor = (): string => {
  const colors = [
    "bg-red-100 text-red-800 border-red-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-teal-100 text-teal-800 border-teal-200",
  ];
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: "/login",
//     },
//   }
// );

// export const config = {
//   matcher: [
//     "/((?!api/auth|login|register|_next|favicon.ico|icons|images|fonts|public|api/reception/pdf/weights.*).*)",
//   ],
// };

export function bufferToBase64FromObject(obj: Record<number, number>): string {
  const uint8Array = new Uint8Array(Object.values(obj));
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}
