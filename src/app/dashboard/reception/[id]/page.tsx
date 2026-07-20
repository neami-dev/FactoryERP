import React from "react";
type ReceptionDetailsProps = {
  params: Promise<{ id: number }>;
};
export default async function ReceptionDetails({
  params,
}: ReceptionDetailsProps) {
  const { id } = await params;

  return <div>ReceptionDetails id: {id}</div>;
}
