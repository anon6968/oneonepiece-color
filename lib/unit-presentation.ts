interface UnitPresentationInput {
  mangaTitle: string;
  unitLabel: string;
  unitNumber: number;
  pageCount: number;
  type: "color" | "partial" | "bw";
  chapterTitle?: string;
  arc?: string;
  saga?: string;
}

/** All reader-page claims derive from the manifest unit type. */
export function unitPresentation(input: UnitPresentationInput) {
  const { mangaTitle, unitLabel, unitNumber, pageCount, type, chapterTitle, arc, saga } = input;
  const lowerTitle = mangaTitle.toLowerCase();
  const lowerUnit = unitLabel.toLowerCase();
  const detail = chapterTitle
    ? `: ${chapterTitle}`
    : arc && arc !== mangaTitle
      ? `: ${arc}${saga && saga !== arc ? ` (${saga})` : ""}`
      : "";
  const base = `${mangaTitle} ${unitLabel} ${unitNumber}${detail}`;

  if (type === "bw") {
    const title = `${base} — Read Manga Online Free (Black & White)`;
    const description = `Read ${mangaTitle} ${lowerUnit} ${unitNumber} online free in high-quality black & white. ${pageCount} HD manga pages with zoom.`;
    return {
      title,
      description,
      keywords: [
        `${lowerTitle} ${lowerUnit} ${unitNumber}`,
        `read ${lowerTitle} ${lowerUnit} ${unitNumber} online`,
        `${lowerTitle} manga black and white`,
      ],
      imageAlt: `${mangaTitle} ${unitLabel} ${unitNumber} black & white cover`,
      seriesName: mangaTitle,
      heading: base,
      copy: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} online free in high-quality black & white. ${pageCount} HD manga pages.`,
      feedTitle: `${base} — black & white`,
      feedDescription: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} in high-quality black & white — ${pageCount} pages, free online.`,
    };
  }

  if (type === "partial") {
    const title = `${base} — Read Partially Colored Manga Online Free`;
    const description = `Read ${mangaTitle} ${lowerUnit} ${unitNumber} online free. ${pageCount} mixed color and black & white HD pages with zoom.`;
    return {
      title,
      description,
      keywords: [
        `${lowerTitle} ${lowerUnit} ${unitNumber} partially colored`,
        `read ${lowerTitle} ${lowerUnit} ${unitNumber} online`,
        `${lowerTitle} manga mixed color`,
      ],
      imageAlt: `${mangaTitle} ${unitLabel} ${unitNumber} partially colored cover`,
      seriesName: `${mangaTitle} (Mixed Color and Black & White Edition)`,
      heading: `${base} — Partially Colored`,
      copy: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} online free. ${pageCount} mixed color and black & white pages.`,
      feedTitle: `${base} — partially colored`,
      feedDescription: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} with mixed color and black & white pages — ${pageCount} pages, free online.`,
    };
  }

  const coloredBase = `${mangaTitle} ${unitLabel} ${unitNumber} Colored${detail}`;
  const title = `${coloredBase} — Read in Full Color Online Free`;
  const description = `Read ${mangaTitle} ${unitLabel} ${unitNumber}${chapterTitle ? ` (${chapterTitle})` : ""} in full color online free${arc && arc !== mangaTitle ? ` — ${arc}${saga !== arc ? `, ${saga}` : ""}` : ""}. ${pageCount} digitally colored HD pages with zoom — the colorized ${mangaTitle} manga.`;
  return {
    title,
    description,
    keywords: [
      `${lowerTitle} ${lowerUnit} ${unitNumber} colored`,
      `${lowerTitle} color ${lowerUnit} ${unitNumber}`,
      `read ${lowerTitle} ${lowerUnit} ${unitNumber} color`,
      ...(chapterTitle ? [`${lowerTitle} ${chapterTitle.toLowerCase()} colored`] : []),
      ...(arc ? [`${lowerTitle} ${arc} colored`.toLowerCase()] : []),
      `colorized ${lowerTitle} manga`,
    ],
    imageAlt: `${mangaTitle} ${unitLabel} ${unitNumber} colored cover`,
    seriesName: `${mangaTitle} (Colored Edition)`,
    heading: coloredBase,
    copy: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} in full color online free. ${pageCount} colorized pages.`,
    feedTitle: `${base} — in full color`,
    feedDescription: `Read ${mangaTitle} ${lowerUnit} ${unitNumber} colorized in full HD — ${pageCount} pages, free online.`,
  };
}

interface AggregatePresentationInput {
  mangaTitle: string;
  unitLabel: string;
  aggregate: "full" | "partial" | "none";
  totalUnits: number;
  coloredUnits: number;
  lastUnit: number;
}

function pluralUnit(unitLabel: string) {
  return `${unitLabel.toLowerCase()}s`;
}

export function listPresentation(input: AggregatePresentationInput) {
  const { mangaTitle, unitLabel, aggregate, totalUnits, coloredUnits, lastUnit } = input;
  const plural = pluralUnit(unitLabel);
  if (aggregate === "full") {
    return {
      title: `All ${mangaTitle} Color Manga ${unitLabel}s — Full ${unitLabel} List`,
      description: `Complete list of all ${totalUnits} colorized ${mangaTitle} manga ${plural}, organized by arc.`,
      heading: `All ${mangaTitle} color manga ${plural}`,
      copy: `All ${totalUnits} ${plural} are in color, through ${unitLabel.toLowerCase()} ${lastUnit}. Tap any cover to start reading.`,
      keywords: [`${mangaTitle.toLowerCase()} colored ${plural}`, `colorized ${mangaTitle.toLowerCase()} manga`],
    };
  }
  if (aggregate === "none") {
    return {
      title: `All ${mangaTitle} Manga ${unitLabel}s — Black & White ${unitLabel} List`,
      description: `Complete list of all ${totalUnits} ${mangaTitle} manga ${plural} in high-quality black & white, organized by arc.`,
      heading: `All ${mangaTitle} manga ${plural}`,
      copy: `All ${totalUnits} available ${plural} are in high-quality black & white, through ${unitLabel.toLowerCase()} ${lastUnit}. Tap any cover to start reading.`,
      keywords: [`${mangaTitle.toLowerCase()} ${plural}`, `${mangaTitle.toLowerCase()} manga black and white`],
    };
  }
  return {
    title: `All ${mangaTitle} Manga ${unitLabel}s — Color and Black & White List`,
    description: `Complete list of ${totalUnits} ${mangaTitle} manga ${plural}: ${coloredUnits} in color and the remainder in high-quality black & white.`,
    heading: `All ${mangaTitle} manga ${plural}`,
    copy: `${coloredUnits} of ${totalUnits} available ${plural} are in color; the remainder are clearly labeled black & white. Updated through ${unitLabel.toLowerCase()} ${lastUnit}.`,
    keywords: [`${mangaTitle.toLowerCase()} ${plural}`, `${mangaTitle.toLowerCase()} colored ${plural}`],
  };
}

export function latestPresentation(input: AggregatePresentationInput) {
  const { mangaTitle, unitLabel, aggregate, totalUnits, coloredUnits, lastUnit } = input;
  const plural = pluralUnit(unitLabel);
  if (aggregate === "full") {
    return {
      title: `Latest ${mangaTitle} Colored ${unitLabel}s — Newest ${mangaTitle} in Color`,
      description: `The latest colorized ${mangaTitle} manga ${plural}, newest first. All ${totalUnits} available ${plural} are in full color.`,
      heading: `Latest ${mangaTitle} colored ${plural}`,
      copy: `The newest colorized ${mangaTitle} ${plural}, most recent first — updated through ${unitLabel.toLowerCase()} ${lastUnit}.`,
      keywords: [`latest ${mangaTitle.toLowerCase()} colored ${unitLabel.toLowerCase()}`, `newest ${mangaTitle.toLowerCase()} color ${unitLabel.toLowerCase()}`],
    };
  }
  if (aggregate === "none") {
    return {
      title: `Latest ${mangaTitle} Manga ${unitLabel}s — Newest First`,
      description: `The latest ${mangaTitle} manga ${plural} in high-quality black & white, newest first.`,
      heading: `Latest ${mangaTitle} ${plural}`,
      copy: `The newest ${mangaTitle} ${plural} in high-quality black & white, most recent first — updated through ${unitLabel.toLowerCase()} ${lastUnit}.`,
      keywords: [`latest ${mangaTitle.toLowerCase()} ${unitLabel.toLowerCase()}`, `newest ${mangaTitle.toLowerCase()} manga ${unitLabel.toLowerCase()}`],
    };
  }
  return {
    title: `Latest ${mangaTitle} Manga ${unitLabel}s — Newest First`,
    description: `The latest ${mangaTitle} manga ${plural}, newest first: ${coloredUnits} of ${totalUnits} available ${plural} in color and the remainder in black & white.`,
    heading: `Latest ${mangaTitle} ${plural}`,
    copy: `Newest first through ${unitLabel.toLowerCase()} ${lastUnit}. ${coloredUnits} of ${totalUnits} available ${plural} are in color; the remainder are clearly labeled black & white.`,
    keywords: [`latest ${mangaTitle.toLowerCase()} ${unitLabel.toLowerCase()}`, `${mangaTitle.toLowerCase()} colored ${unitLabel.toLowerCase()} list`],
  };
}
