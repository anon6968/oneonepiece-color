import type { Metadata } from "next";
import { UnitReaderPage, buildUnitMetadata, unitStaticParams } from "@/lib/unit-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return unitStaticParams("chapter");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}): Promise<Metadata> {
  return buildUnitMetadata("chapter", params);
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}) {
  return <UnitReaderPage unit="chapter" params={params} />;
}
