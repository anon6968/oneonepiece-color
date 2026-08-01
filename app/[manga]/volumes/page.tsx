import type { Metadata } from "next";
import { UnitListPage, buildListMetadata, listStaticParams } from "@/lib/list-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return listStaticParams("volume");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}): Promise<Metadata> {
  return buildListMetadata("volume", params);
}

export default async function VolumesPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  return <UnitListPage unit="volume" params={params} />;
}
