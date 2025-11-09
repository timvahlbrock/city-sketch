import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { visionId: string };
}) {
  const visionId = params.visionId;

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
