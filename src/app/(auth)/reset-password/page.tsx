import ResetPassowrd from "@/components/auth/ResetPassowrd";
import { redirect } from "next/navigation";
import React from "react";
type Props = {
  searchParams: Promise<{ token: string }>;
};
export default async function page({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect("/login");
  return <ResetPassowrd token={token} />;
}
