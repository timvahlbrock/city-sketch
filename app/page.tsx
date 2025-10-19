"use server";

import { getLayers } from "@/app/layers";
import Home from "@/app/home";

export default async function Page() {
  return <Home layers={await getLayers()} />;
}
