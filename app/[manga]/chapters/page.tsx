import type { Metadata } from "next";
import { UnitListPage, buildListMetadata, listStaticParams } from "@/lib/list-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return listStaticParams("chapter");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}): Promise<Metadata> {
  return buildListMetadata("chapter", params);
}

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  return <UnitListPage unit="chapter" params={params} />;
}
