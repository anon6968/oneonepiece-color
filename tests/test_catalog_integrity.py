import json
import re
import subprocess
import unittest
from pathlib import Path


WEB = Path(__file__).resolve().parents[1]
ROOT = WEB.parent
REGISTRY = (WEB / "lib/manga.ts").read_text()
BASELINE_URLS = ROOT / "research/colorized-manga/2026-08-07/production-urls-before.txt"
BASELINE_SHA = "a84ecad24e6f0250a892e3dfddbc887787d308c3"

SHA_BASE = re.compile(
    r"^https://cdn\.jsdelivr\.net/gh/anon6968/[a-z0-9.-]+@([0-9a-f]{40})/pages$"
)


def _hand_entries():
    start = REGISTRY.index("const HAND_MANGAS: Manga[] = [")
    end = REGISTRY.index("\n];", start)
    body = REGISTRY[start:end]
    lines = body.splitlines(keepends=True)
    blocks = []
    current = None
    for line in lines:
        if line.rstrip("\n") == "  {":
            current = [line]
        elif current is not None:
            current.append(line)
            if line.rstrip("\n") == "  },":
                blocks.append("".join(current))
                current = None
    entries = []
    for block in blocks:
        def value(name, default=None):
            match = re.search(rf"\n    {name}: \"([^\"]+)\"", block)
            return match.group(1) if match else default

        base = re.search(r"\n    imageBase: ([A-Z0-9_]+|\"[^\"]+\")", block)
        entries.append(
            {
                "slug": value("slug"),
                "status": value("status"),
                "color": value("color"),
                "colorNote": value("colorNote"),
                "unit": value("unit"),
                "imageToken": base.group(1) if base else None,
                "hidden": "\n    hidden: true" in block,
                "parts": "\n    parts:" in block,
            }
        )
    return entries


def _constants():
    constants = {}
    for name, value in re.findall(
        r'const ([A-Z0-9_]+)\s*=\s*\n?\s*"([^"]+)"', REGISTRY
    ):
        constants[name] = value
    return constants


def catalog():
    rows = raw_catalog()
    # Hand entries win slug conflicts, matching lib/manga.ts.
    result = {}
    for row in rows:
        result.setdefault(row["slug"], row)
    return result


def raw_catalog():
    constants = _constants()
    rows = []
    for row in _hand_entries():
        token = row.pop("imageToken")
        row["imageBase"] = (
            token[1:-1] if token and token.startswith('"') else constants.get(token)
        )
        row["source"] = "hand"
        rows.append(row)
    for raw in json.loads((WEB / "data/auto-series.json").read_text()):
        rows.append(
            {
                "slug": raw["slug"],
                "status": raw["status"],
                "color": raw["color"],
                "colorNote": raw.get("colorNote"),
                "unit": raw["unit"],
                "imageBase": raw["imageBase"],
                "hidden": raw.get("hidden", False),
                "parts": bool(raw.get("parts")),
                "source": "auto",
            }
        )
    return rows


def run_typescript(module, expression):
    result = subprocess.run(
        [
            "node",
            "--experimental-strip-types",
            "--input-type=module",
            "--eval",
            (
                f'import * as subject from "./{module}"; '
                f"console.log(JSON.stringify({expression}));"
            ),
        ],
        cwd=WEB,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def manifest(slug):
    return json.loads((WEB / "data/manga" / slug / "index.json").read_text())


def candidate_urls(rows):
    site = "https://colorizedmangas.com"
    urls = {site + p for p in ("", "/contact", "/dmca", "/terms", "/privacy")}
    for row in rows.values():
        if row["hidden"] or row["status"] != "live":
            continue
        slug = row["slug"]
        urls.add(f"{site}/{slug}")
        if row["parts"]:
            continue
        plural = "volumes" if row["unit"] == "volume" else "chapters"
        singular = "volume" if row["unit"] == "volume" else "chapter"
        urls.update((f"{site}/{slug}/{plural}", f"{site}/{slug}/latest"))
        for chapter in manifest(slug)["chapters"]:
            urls.add(f"{site}/{slug}/{singular}/{chapter['chapter']}")
    return urls


class CatalogIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows = catalog()
        cls.live = {
            slug: row
            for slug, row in cls.rows.items()
            if row["status"] == "live" and not row["hidden"]
        }

    def test_live_slugs_and_derived_canonicals_are_unique(self):
        raw_live = [
            row for row in raw_catalog() if row["status"] == "live" and not row["hidden"]
        ]
        # Inspect both raw registries before the documented hand-entry override.
        # A hand row may intentionally replace an auto row (currently Dragon Ball
        # and Akira), but neither source may contain an internal duplicate.
        for source in ("hand", "auto"):
            source_slugs = [row["slug"] for row in raw_live if row["source"] == source]
            self.assertEqual(len(source_slugs), len(set(source_slugs)), source)

        slugs = list(self.live)
        self.assertEqual(len(slugs), len(set(slugs)))
        canonicals = [f"https://colorizedmangas.com/{slug}" for slug in slugs]
        self.assertEqual(len(canonicals), len(set(canonicals)))

    def test_sparse_unit_jump_accepts_only_exact_available_units(self):
        helper = WEB / "lib/unit-availability.ts"
        self.assertTrue(helper.exists(), "unit availability behavior helper is missing")
        actual = run_typescript(
            "lib/unit-availability.ts",
            "({ darling: ['1', '54', '57', '58'].map(v => subject.availableUnit(v, [54, 55, 56, 57])), spy: ['111', '112', '113'].map(v => subject.availableUnit(v, [...Array.from({length: 111}, (_, i) => i + 1), 113, 114, 115, 116, 117])), labels: [subject.availableUnitHint([54, 55, 56, 57]), subject.availableUnitHint([...Array.from({length: 111}, (_, i) => i + 1), 113, 114, 115, 116, 117])]})",
        )
        self.assertEqual([None, 54, 57, None], actual["darling"])
        self.assertEqual([111, None, 113], actual["spy"])
        self.assertEqual(["54–57", "available chapters only"], actual["labels"])

    def test_bw_unit_presentation_never_uses_color_claims(self):
        helper = WEB / "lib/unit-presentation.ts"
        self.assertTrue(helper.exists(), "unit SEO presentation behavior helper is missing")
        actual = run_typescript(
            "lib/unit-presentation.ts",
            "({ bw: subject.unitPresentation({mangaTitle: 'SPY x FAMILY', unitLabel: 'Chapter', unitNumber: 38, pageCount: 24, type: 'bw'}), color: subject.unitPresentation({mangaTitle: 'SPY x FAMILY', unitLabel: 'Chapter', unitNumber: 19, pageCount: 24, type: 'color'}), attackBw: subject.unitPresentation({mangaTitle: 'Attack on Titan', unitLabel: 'Chapter', unitNumber: 1, pageCount: 50, type: 'bw'}), attackColor: subject.unitPresentation({mangaTitle: 'Attack on Titan', unitLabel: 'Chapter', unitNumber: 93, pageCount: 45, type: 'color'}) })",
        )
        bw_text = json.dumps(actual["bw"]).lower()
        self.assertNotRegex(bw_text, r"color(?:ed|ized)?|full color")
        self.assertIn("black & white", bw_text)
        color_text = json.dumps(actual["color"]).lower()
        self.assertRegex(color_text, r"color(?:ed|ized)?|full color")
        self.assertNotRegex(json.dumps(actual["attackBw"]).lower(), r"color(?:ed|ized)?|full color")
        self.assertRegex(json.dumps(actual["attackColor"]).lower(), r"color(?:ed|ized)?|full color")

    def test_partial_list_presentation_is_honest_about_mixed_units(self):
        exports = run_typescript(
            "lib/unit-presentation.ts", "typeof subject.listPresentation"
        )
        self.assertEqual("function", exports)
        actual = run_typescript(
            "lib/unit-presentation.ts",
            "subject.listPresentation({mangaTitle: 'One Piece', unitLabel: 'Chapter', aggregate: 'partial', totalUnits: 1153, coloredUnits: 1139, partialUnits: 14, bwUnits: 0, lastUnit: 1171})",
        )
        text = json.dumps(actual).lower()
        self.assertIn("1139", text)
        self.assertIn("14 partially colored", text)
        self.assertNotIn("black & white", text)
        self.assertNotIn("every colorized", text)
        self.assertNotIn("any chapter in full color", text)

    def test_partial_latest_presentation_is_honest_about_mixed_units(self):
        exports = run_typescript(
            "lib/unit-presentation.ts", "typeof subject.latestPresentation"
        )
        self.assertEqual("function", exports)
        actual = run_typescript(
            "lib/unit-presentation.ts",
            "subject.latestPresentation({mangaTitle: 'SPY x FAMILY', unitLabel: 'Chapter', aggregate: 'partial', totalUnits: 117, coloredUnits: 37, partialUnits: 0, bwUnits: 80, lastUnit: 118})",
        )
        text = json.dumps(actual).lower()
        self.assertIn("37", text)
        self.assertIn("117", text)
        self.assertIn("80", text)
        self.assertIn("black & white", text)
        self.assertNotIn("most recent chapters in full color", text)

    def test_stats_and_partial_faq_report_actual_colored_pages(self):
        expected = sum(
            chapter["pageCount"]
            for chapter in manifest("spy-x-family")["chapters"]
            if chapter["type"] == "color"
        )
        actual = run_typescript("lib/data.ts", "subject.stats('spy-x-family')")
        self.assertEqual(expected, actual.get("coloredPages"))
        self.assertLess(actual["coloredPages"], actual["totalPages"])
        faq_source = (WEB / "app/[manga]/page.tsx").read_text()
        faq_body = faq_source[
            faq_source.index("function seriesFaqs") : faq_source.index("function LiveManga")
        ]
        self.assertIn("s.coloredPages.toLocaleString", faq_body)

    def test_reader_surfaces_are_wired_to_manifest_unit_types(self):
        unit_page = (WEB / "lib/unit-page.tsx").read_text()
        feed = (WEB / "app/feed.xml/route.ts").read_text()
        list_page = (WEB / "lib/list-page.tsx").read_text()
        latest_page = (WEB / "app/[manga]/latest/page.tsx").read_text()
        reader = (WEB / "components/reader/Reader.tsx").read_text()
        menu = (WEB / "components/reader/ChapterMenu.tsx").read_text()
        end_card = (WEB / "components/reader/EndCard.tsx").read_text()
        self.assertIn("unitPresentation({", unit_page)
        self.assertIn("type: ch.type", unit_page)
        self.assertIn("unitPresentation({", feed)
        self.assertIn("type: c.type", feed)
        self.assertIn("listPresentation({", list_page)
        self.assertIn("latestPresentation({", latest_page)
        self.assertIn("unitTypes", reader)
        self.assertIn("unitTypes", menu)
        self.assertIn("available", menu)
        self.assertIn("type={type}", reader)
        self.assertIn("type:", end_card)

    def test_hub_and_machine_readable_totals_use_colored_pages(self):
        home = (WEB / "app/page.tsx").read_text()
        llms = (WEB / "app/llms.txt/route.ts").read_text()
        self.assertIn("stats(m.slug).coloredPages", home)
        self.assertIn("stats(m.slug).coloredPages", llms)
        self.assertNotIn("live in full color right now", home)
        self.assertNotIn("${s.total} colorized", llms)
        self.assertNotIn("Every page is digitally colored", llms)
        self.assertIn("if (m.parts)", llms)
        self.assertIn("mangaPath(m.slug)", llms)

    def test_shared_cards_footer_feed_and_site_copy_are_type_honest(self):
        footer = (WEB / "components/Footer.tsx").read_text()
        chapter_card = (WEB / "components/ChapterCard.tsx").read_text()
        manga_card = (WEB / "components/MangaCard.tsx").read_text()
        site = (WEB / "lib/site.ts").read_text()
        feed = (WEB / "app/feed.xml/route.ts").read_text()
        self.assertIn('m.color === "none"', footer)
        self.assertIn('c.type === "bw"', chapter_card)
        self.assertIn('manga.color === "partial"', manga_card)
        self.assertNotIn('alt={`${manga.title} colored manga cover`}', manga_card)
        self.assertNotIn('every chapter digitally colored', site.lower())
        self.assertNotIn('latest colored chapters</title>', feed)

    def test_partial_faq_and_progress_report_exact_aggregate_counts(self):
        faq_source = (WEB / "app/[manga]/page.tsx").read_text()
        faq_body = faq_source[
            faq_source.index("function seriesFaqs") : faq_source.index("function LiveManga")
        ]
        info = (WEB / "components/MangaInfoPanel.tsx").read_text()
        self.assertIn("s.partial", faq_body)
        self.assertIn("s.bw", faq_body)
        self.assertNotIn("Those are in full color here; the rest", faq_body)
        self.assertIn("{s.colored} of {totalExpected} colored", info)

    def test_docs_describe_the_multi_series_immutable_source_model(self):
        readme = (WEB / "README.md").read_text()
        env_example = (WEB / ".env.example").read_text()
        self.assertNotIn("Currently only `one-piece` is populated", readme)
        self.assertNotIn("NEXT_PUBLIC_IMAGE_BASE", readme)
        self.assertNotIn("NEXT_PUBLIC_IMAGE_BASE", env_example)
        self.assertIn("immutable", readme.lower())
        self.assertRegex(readme.lower(), r"provenance[^.]*not[^.]*licen[cs]")

    def test_every_public_live_image_base_is_immutable(self):
        invalid = {
            slug: row["imageBase"]
            for slug, row in self.live.items()
            if not row["parts"] and not SHA_BASE.fullmatch(row["imageBase"] or "")
        }
        self.assertEqual({}, invalid)

    def test_aggregate_color_claim_matches_baked_manifest_types(self):
        mismatches = {}
        for slug, row in self.live.items():
            if row["parts"]:
                continue
            types = {ch["type"] for ch in manifest(slug)["chapters"]}
            expected = "full" if types == {"color"} else "partial" if "color" in types else "none"
            problems = []
            if row["color"] != expected:
                problems.append((row["color"], expected, sorted(types)))
            if expected == "partial" and not row["colorNote"]:
                problems.append("partial coverage requires an exact note")
            if problems:
                mismatches[slug] = problems
        self.assertEqual({}, mismatches)

    def test_reader_navigation_uses_available_units_not_numeric_arithmetic(self):
        source = (WEB / "lib/data.ts").read_text()
        body = source[source.index("export function neighbours") : source.index("export interface SagaGroup")]
        self.assertIn("nums[i - 1]", body)
        self.assertIn("nums[i + 1]", body)
        self.assertNotRegex(body, r"\bn\s*[+-]\s*1\b")

    def test_every_public_index_has_one_valid_manifest_per_real_unit(self):
        problems = []
        for slug, row in self.live.items():
            if row["parts"]:
                continue
            index = manifest(slug)
            chapters = index["chapters"]
            numbers = [entry["chapter"] for entry in chapters]
            if index["count"] != len(chapters) or numbers != sorted(set(numbers)):
                problems.append(f"{slug}: invalid index count/order")
                continue
            chapter_dir = WEB / "data/manga" / slug / "chapters"
            files = {int(path.stem) for path in chapter_dir.glob("[0-9]*.json")}
            if files != set(numbers):
                problems.append(f"{slug}: index/file mismatch")
                continue
            for entry in chapters:
                chapter = json.loads((chapter_dir / f"{entry['chapter']}.json").read_text())
                pages = chapter["pages"]
                if (
                    chapter["chapter"] != entry["chapter"]
                    or chapter["type"] != entry["type"]
                    or chapter["pageCount"] != entry["pageCount"]
                    or len(pages) != entry["pageCount"]
                    or [page["n"] for page in pages] != sorted({page["n"] for page in pages})
                    or any(
                        page["n"] < 1
                        or (page.get("w") is not None and page["w"] < 1)
                        or (page.get("h") is not None and page["h"] < 1)
                        for page in pages
                    )
                ):
                    problems.append(f"{slug}/{entry['chapter']}: invalid manifest")
        self.assertEqual([], problems)

    def test_ten_selected_activations_are_exact(self):
        expected = {
            "attack-on-titan": (
                139,
                {63, 82, 91, 92, 93, *range(97, 136), 138, 139},
                "partial",
            ),
            "haikyu": (402, set(range(1, 403)), "full"),
            "seven-deadly-sins": (346, {324}, "partial"),
            "black-clover": (392, set(range(202, 229)), "partial"),
            "spy-x-family": (117, set(range(1, 38)), "partial"),
            "parasyte": (64, set(range(1, 65)), "full"),
            "vinland-saga": (220, {71, 180}, "partial"),
            "blue-exorcist": (150, set(range(1, 8)), "partial"),
            "darling-in-the-franxx": (4, {54, 55, 56, 57}, "full"),
            "jojo-s-bizarre-adventure-part-9-the-jojo": (30, set(range(1, 31)), "full"),
        }
        for slug, (count, colored, aggregate) in expected.items():
            self.assertIn(slug, self.live)
            chapters = manifest(slug)["chapters"]
            self.assertEqual(count, len(chapters), slug)
            self.assertEqual(colored, {c["chapter"] for c in chapters if c["type"] == "color"}, slug)
            self.assertEqual(aggregate, self.live[slug]["color"], slug)
        golden = manifest("jojo-no-kimyou-na-bouken-part-5-ougon-no")
        self.assertEqual(155, len(golden["chapters"]))
        self.assertIn(36, {c["chapter"] for c in golden["chapters"]})

    def test_changed_chapter_files_are_exactly_the_approved_delta(self):
        expected = {
            "attack-on-titan": {93},
            "haikyu": set(range(1, 403)),
            "seven-deadly-sins": {324},
            "black-clover": set(range(202, 229))
            | {196, 197, 199, *range(273, 282), 290, 346, 347, 348, 359, 360, 369},
            "spy-x-family": set(range(1, 38)),
            "parasyte": set(range(1, 65)),
            "vinland-saga": {71, 180},
            "blue-exorcist": set(range(1, 8)),
            "darling-in-the-franxx": {54, 55, 56, 57},
            "jojo-no-kimyou-na-bouken-part-5-ougon-no": {36},
            "jojo-s-bizarre-adventure-part-9-the-jojo": {30},
        }
        expected_paths = {
            f"data/manga/{slug}/chapters/{number}.json"
            for slug, numbers in expected.items()
            for number in numbers
        }
        tracked = subprocess.run(
            ["git", "-C", str(WEB), "diff", "--name-only", BASELINE_SHA, "--", "data/manga"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.splitlines()
        untracked = subprocess.run(
            [
                "git", "-C", str(WEB), "ls-files", "--others", "--exclude-standard",
                "data/manga/*/chapters/*.json",
            ],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.splitlines()
        actual = {
            path for path in [*tracked, *untracked]
            if re.fullmatch(r"data/manga/[^/]+/chapters/[0-9]+\.json", path)
        }
        self.assertEqual(expected_paths, actual)

    def test_every_old_production_url_is_preserved(self):
        before = {line.strip().rstrip("/") for line in BASELINE_URLS.read_text().splitlines() if line.strip()}
        after = {url.rstrip("/") for url in candidate_urls(self.rows)}
        self.assertEqual(set(), before - after)

    def test_no_route_is_removed_without_eligible_evidence(self):
        before = {line.strip().rstrip("/") for line in BASELINE_URLS.read_text().splitlines() if line.strip()}
        after = {url.rstrip("/") for url in candidate_urls(self.rows)}
        removed = before - after
        evidence = (ROOT / "research/colorized-manga/2026-08-07/removal-evidence.tsv").read_text()
        approved = {
            line.split("\t", 1)[0]
            for line in evidence.splitlines()[1:]
            if "\tremove\t" in line and "\teligible\t" in line
        }
        self.assertEqual(set(), removed - approved)


if __name__ == "__main__":
    unittest.main()
