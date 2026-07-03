import type { Metadata } from "next";
import { UnitReaderPage, buildUnitMetadata, unitStaticParams } from "@/lib/unit-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return unitStaticParams("volume");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}): Promise<Metadata> {
  return buildUnitMetadata("volume", params);
}

export default async function VolumePage({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}) {
  return <UnitReaderPage unit="volume" params={params} />;
}
