"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const { visionId } = useParams();

  return (
    <>
      <h1 style={{ fontWeight: "bold", fontSize: "x-large" }}>
        Vision {visionId}
      </h1>
      <br />
      <Link href={"/"}>Go Back</Link>
    </>
  );
}
