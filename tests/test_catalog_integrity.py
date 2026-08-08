import hashlib
import json
import re
import shutil
import struct
import subprocess
import unittest
from pathlib import Path


WEB = Path(__file__).resolve().parents[1]
ROOT = WEB.parent
REGISTRY = (WEB / "lib/manga.ts").read_text()
BASELINE_URLS = ROOT / "research/colorized-manga/2026-08-07/production-urls-before.txt"
CURRENT_BASELINE_URLS = ROOT / "research/colorized-manga/2026-08-08/production-urls-before.txt"
CURRENT_BASELINE_SHA256 = "0347633ea2d5602441095aa45c03947d53c644713ebd27e56d57bfd83587530f"
BASELINE_SHA = "a84ecad24e6f0250a892e3dfddbc887787d308c3"

SHA_BASE = re.compile(
    r"^https://cdn\.jsdelivr\.net/gh/anon6968/[a-z0-9.-]+@([0-9a-f]{40})/pages$"
)

# These archives contain only colored units, but are intentionally partial at
# series level because their exact metadata discloses unhosted source chapters.
COLOR_ONLY_PARTIAL_SLUGS = {
    "undead-unluck",
    "made-in-abyss",
    "miss-kobayashis-dragon-maid",
    "dragon-ball-sd",
}


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
                "poster": value("poster"),
                "imageToken": base.group(1) if base else None,
                "hidden": "\n    hidden: true" in block,
                "parts": "\n    parts:" in block,
                "partSlugs": re.findall(
                    r'\{ slug: "([^"]+)", title:',
                    block[block.index("\n    parts:") :] if "\n    parts:" in block else "",
                ),
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
                "poster": raw.get("poster"),
                "imageBase": raw["imageBase"],
                "hidden": raw.get("hidden", False),
                "parts": bool(raw.get("parts")),
                "partSlugs": [part["slug"] for part in raw.get("parts", [])],
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


def image_dimensions(path):
    data = path.read_bytes()
    if data.startswith(b"\x89PNG\r\n\x1a\n") and len(data) >= 24:
        return struct.unpack(">II", data[16:24])

    if data.startswith(b"\xff\xd8"):
        offset = 2
        sof_markers = {
            0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
            0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF,
        }
        while offset < len(data):
            while offset < len(data) and data[offset] == 0xFF:
                offset += 1
            if offset >= len(data):
                break
            marker = data[offset]
            offset += 1
            if marker in {0x01, *range(0xD0, 0xDA)}:
                continue
            if offset + 2 > len(data):
                break
            segment_length = struct.unpack(">H", data[offset : offset + 2])[0]
            if segment_length < 2 or offset + segment_length > len(data):
                break
            if marker in sof_markers and segment_length >= 7:
                height, width = struct.unpack(">HH", data[offset + 3 : offset + 7])
                return width, height
            offset += segment_length

    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        offset = 12
        while offset + 8 <= len(data):
            chunk = data[offset : offset + 4]
            size = struct.unpack("<I", data[offset + 4 : offset + 8])[0]
            payload = data[offset + 8 : offset + 8 + size]
            if chunk == b"VP8X" and len(payload) >= 10:
                width = 1 + int.from_bytes(payload[4:7], "little")
                height = 1 + int.from_bytes(payload[7:10], "little")
                return width, height
            if chunk == b"VP8 " and len(payload) >= 10 and payload[3:6] == b"\x9d\x01\x2a":
                width, height = struct.unpack("<HH", payload[6:10])
                return width & 0x3FFF, height & 0x3FFF
            if chunk == b"VP8L" and len(payload) >= 5 and payload[0] == 0x2F:
                bits = int.from_bytes(payload[1:5], "little")
                return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
            offset += 8 + size + (size % 2)

    raise ValueError("unsupported or malformed JPEG/PNG/WebP image")


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


def top_level_live(rows):
    part_slugs = {
        part_slug
        for row in rows.values()
        for part_slug in row["partSlugs"]
    }
    # Mirrors the duplicate romaji Part 9 exclusion in lib/manga.ts.
    part_slugs.add("jojo-no-kimyou-na-bouken-dai-9-bu-the-jo")
    return {
        slug: row
        for slug, row in rows.items()
        if row["status"] == "live" and not row["hidden"] and slug not in part_slugs
    }


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
        self.assertIn("m.parts ? mangaPath(m.slug) : listPath(m)", footer)
        self.assertIn("m.parts.length", footer)
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

    def test_partial_series_metadata_distinguishes_partial_from_bw_remainders(self):
        exported = run_typescript(
            "lib/unit-presentation.ts", "typeof subject.seriesMetadataPresentation"
        )
        self.assertEqual("function", exported)
        actual = run_typescript(
            "lib/unit-presentation.ts",
            "({onePiece: subject.seriesMetadataPresentation({mangaTitle:'One Piece',author:'Eiichiro Oda',unitLabel:'Chapter',live:true,aggregate:'partial',totalUnits:1153,coloredUnits:1139,partialUnits:14,bwUnits:0}),spy: subject.seriesMetadataPresentation({mangaTitle:'SPY x FAMILY',author:'Tatsuya Endo',unitLabel:'Chapter',live:true,aggregate:'partial',totalUnits:117,coloredUnits:37,partialUnits:0,bwUnits:80})})",
        )
        one_piece = json.dumps(actual["onePiece"]).lower()
        self.assertIn("14 partially colored", one_piece)
        self.assertNotIn("black & white", one_piece)
        self.assertNotIn("read in full color", one_piece)
        spy = json.dumps(actual["spy"]).lower()
        self.assertIn("80 black & white", spy)
        self.assertNotIn("read in full color", spy)
        landing = (WEB / "app/[manga]/page.tsx").read_text()
        self.assertIn("seriesMetadataPresentation({", landing)

    def test_fan_translation_is_not_mislabeled_as_fan_coloring(self):
        actual = run_typescript(
            "lib/unit-presentation.ts",
            "({fanColor: subject.isFanColoredNote('Fan-colored selection only'), fanTranslation: subject.isFanColoredNote('Official full-color art with fan English translation')})",
        )
        self.assertTrue(actual["fanColor"])
        self.assertFalse(actual["fanTranslation"])
        landing = (WEB / "app/[manga]/page.tsx").read_text()
        self.assertIn("isFanColoredNote(m.colorNote)", landing)
        self.assertNotIn('includes("fan")', landing)

    def test_one_piece_copy_and_black_clover_total_match_baked_coverage(self):
        one_piece = next(row for row in _hand_entries() if row["slug"] == "one-piece")
        black_clover = next(row for row in _hand_entries() if row["slug"] == "black-clover")
        registry = REGISTRY.lower()
        one_piece_block = registry[
            registry.index('slug: "one-piece"') : registry.index('slug: "naruto"')
        ]
        self.assertNotIn("every chapter", one_piece_block)
        self.assertIn("1,139", one_piece_block)
        self.assertIn("14", one_piece_block)
        black_clover_block = REGISTRY[
            REGISTRY.index('slug: "black-clover"') : REGISTRY.index('slug: "blue-lock"')
        ]
        self.assertIn("totalChapters: 392", black_clover_block)

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

    def test_every_public_top_level_live_title_has_a_local_poster(self):
        problems = {}
        for slug, row in top_level_live(self.rows).items():
            poster = row["poster"]
            if not poster:
                problems[slug] = "poster is not declared"
            elif not re.fullmatch(r"/covers/[^/]+\.(?:jpe?g|png|webp)", poster):
                problems[slug] = f"poster is not a local /covers image: {poster}"
            elif not (WEB / "public" / poster.removeprefix("/")).is_file():
                problems[slug] = f"poster file does not exist: {poster}"
        self.assertEqual({}, problems)

    def test_declared_public_top_level_posters_meet_quality_contract(self):
        magick = shutil.which("magick")
        self.assertIsNotNone(
            magick,
            "ImageMagick 'magick' is required to fully decode poster pixels",
        )
        problems = {}
        hashes = {}
        for slug, row in top_level_live(self.rows).items():
            poster = row["poster"]
            if not poster or not re.fullmatch(r"/covers/[^/]+\.(?:jpe?g|png|webp)", poster):
                continue
            path = WEB / "public" / poster.removeprefix("/")
            if not path.is_file():
                continue

            issues = []
            decoded = subprocess.run(
                [magick, "-regard-warnings", str(path), "null:"],
                capture_output=True,
                text=True,
            )
            if decoded.returncode:
                detail = decoded.stderr.strip() or decoded.stdout.strip() or "no diagnostic"
                issues.append(
                    f"does not fully decode (ImageMagick exit {decoded.returncode}): {detail}"
                )
            try:
                width, height = image_dimensions(path)
            except (OSError, ValueError, struct.error) as error:
                issues.append(f"does not decode: {error}")
            else:
                if width < 600 or height < 800:
                    issues.append(f"dimensions {width}x{height} are below 600x800")
                ratio = width / height
                if not 0.70 <= ratio <= 0.80:
                    issues.append(f"aspect ratio {ratio:.3f} is outside 0.70-0.80")
            size = path.stat().st_size
            if size > 400 * 1024:
                issues.append(f"size {size} bytes exceeds 400KB")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            hashes.setdefault(digest, []).append(slug)
            if issues:
                problems[slug] = issues

        for digest, slugs in hashes.items():
            if len(slugs) > 1:
                for slug in slugs:
                    problems.setdefault(slug, []).append(
                        f"SHA-256 {digest} is shared by {', '.join(slugs)}"
                    )
        self.assertEqual({}, problems)

    def test_aggregate_color_claim_matches_baked_manifest_types(self):
        mismatches = {}
        for slug, row in self.live.items():
            if row["parts"]:
                continue
            types = {ch["type"] for ch in manifest(slug)["chapters"]}
            # A sparse color-only archive can still be `partial` at series
            # level when unhosted source chapters are explicitly disclosed.
            if types == {"color"}:
                expected = (
                    {"partial"} if slug in COLOR_ONLY_PARTIAL_SLUGS else {"full"}
                )
            else:
                expected = {"partial"} if "color" in types else {"none"}
            problems = []
            if row["color"] not in expected:
                problems.append((row["color"], expected, sorted(types)))
            if row["color"] == "partial" and not row["colorNote"]:
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

    def test_ten_famous_2026_08_08_additions_are_exact(self):
        expected = {
            "dragon-ball-super": (set(range(1, 105)), "chapter", "full"),
            "undead-unluck": (set(range(1, 71)), "chapter", "partial"),
            "made-in-abyss": ({*range(1, 10), *range(47, 53)}, "chapter", "partial"),
            "highschool-of-the-dead": (set(range(1, 8)), "volume", "full"),
            "miss-kobayashis-dragon-maid": (
                {2, 30, 31, 33, 43, 46, 54, 55, 62, 63, 81, 91},
                "chapter",
                "partial",
            ),
            "tomo-chan-is-a-girl": (set(range(1, 23)), "chapter", "full"),
            "sand-land": (set(range(1, 11)), "chapter", "full"),
            "thus-spoke-rohan-kishibe": (set(range(1, 13)), "chapter", "full"),
            "to-love-ru-darkness": (set(range(0, 78)), "chapter", "full"),
            "dragon-ball-sd": (set(range(1, 45)), "chapter", "partial"),
        }
        expected_image_bases = {
            "dragon-ball-super": "https://cdn.jsdelivr.net/gh/anon6968/dragon-ball-super-official-color-archive-color-pages@1764c88f609eadfb50c1ef4a997df1ab62defaaa/pages",
            "undead-unluck": "https://cdn.jsdelivr.net/gh/anon6968/undead-unluck-official-color-archive-color-pages@77aeaa15a2129102915454b43e75904c826fa8f0/pages",
            "made-in-abyss": "https://cdn.jsdelivr.net/gh/anon6968/made-in-abyss-color-pages@3269e2b2eca011c810801dc522e306e589ab571a/pages",
            "highschool-of-the-dead": "https://cdn.jsdelivr.net/gh/anon6968/high-school-of-the-dead-full-color-archive-color-pages@39fe3e674ab043c4663be8e49cc41005d022ed08/pages",
            "miss-kobayashis-dragon-maid": "https://cdn.jsdelivr.net/gh/anon6968/miss-kobayashis-dragon-maid-color-archive-color-pages@8a7db94b795cda39c813c6a0eef434e9c0a86e3c/pages",
            "tomo-chan-is-a-girl": "https://cdn.jsdelivr.net/gh/anon6968/tomo-chan-is-a-girl-color-pages@9dc2d14ac73cc1f0b206185d9933d471da904db9/pages",
            "sand-land": "https://cdn.jsdelivr.net/gh/anon6968/sand-land-official-color-archive-color-pages@472a40e2991a91b6491029a6bffa3cd536cbfa9b/pages",
            "thus-spoke-rohan-kishibe": "https://cdn.jsdelivr.net/gh/anon6968/thus-spoke-rohan-kishibe-color-pages@5d205a2b50a61d1e7764460d456d56f3373c242e/pages",
            "to-love-ru-darkness": "https://cdn.jsdelivr.net/gh/anon6968/to-love-ru-darkness-color-pages@85d4761d91e590ca93590f57a784ad4e1d56e76b/pages",
            "dragon-ball-sd": "https://cdn.jsdelivr.net/gh/anon6968/dragon-ball-sd-color-pages@3ebe0bbd45005ac510ea63264e678e1524ad8869/pages",
        }
        actual_entries = {
            row["slug"]: row for row in json.loads((WEB / "data/auto-series.json").read_text())
        }
        for slug, (available, unit, color) in expected.items():
            self.assertIn(slug, self.live)
            self.assertIn(slug, actual_entries)
            entry = actual_entries[slug]
            self.assertEqual("live", entry["status"], slug)
            self.assertEqual(color, entry["color"], slug)
            self.assertEqual(unit, entry["unit"], slug)
            self.assertEqual(available, {c["chapter"] for c in manifest(slug)["chapters"]}, slug)
            self.assertEqual({"color"}, {c["type"] for c in manifest(slug)["chapters"]}, slug)
            self.assertEqual(expected_image_bases[slug], entry["imageBase"], slug)
            self.assertRegex(entry["imageBase"], SHA_BASE)
            self.assertEqual(f"/covers/{slug}.jpg", entry["poster"], slug)

        # The reader parser and static route inventory intentionally admit a
        # real chapter 0; To Love-Ru Darkness must not silently lose its prologue.
        unit_page = (WEB / "lib/unit-page.tsx").read_text()
        self.assertIn("v >= 0", unit_page)
        self.assertIn(
            "https://colorizedmangas.com/to-love-ru-darkness/chapter/0",
            candidate_urls(self.rows),
        )

        before = {
            line.strip().rstrip("/")
            for line in CURRENT_BASELINE_URLS.read_text().splitlines()
            if line.strip()
        }
        after = {url.rstrip("/") for url in candidate_urls(self.rows)}
        # Ten new series add 404 URLs; the same release also admits four
        # independently verified missing color chapters below.
        self.assertEqual(408, len(after - before))

    def test_2026_08_08_verified_existing_series_gaps_are_filled(self):
        expected = {
            "hoshin-engi": (
                set(range(1, 50)),
                "https://cdn.jsdelivr.net/gh/anon6968/hoshin-engi-color-pages@1a960b92df020b3b56effcc19f13559271539054/pages",
            ),
            "shadows-house": (
                set(range(1, 239)),
                "https://cdn.jsdelivr.net/gh/anon6968/shadows-house-color-pages@f7efc4fb53461753133157651636199c79ef4f90/pages",
            ),
        }
        for slug, (available, image_base) in expected.items():
            self.assertEqual(available, {c["chapter"] for c in manifest(slug)["chapters"]}, slug)
            self.assertEqual({"color"}, {c["type"] for c in manifest(slug)["chapters"]}, slug)
            self.assertEqual(image_base, self.live[slug]["imageBase"], slug)

    def test_route_neutral_2026_08_08_color_overlays_are_exact(self):
        expected = {
            "sakamoto-days": (
                set(range(1, 8)),
                "https://cdn.jsdelivr.net/gh/anon6968/sakamoto-days-color-pages@009b33b5e546bdd83926bd97d5f0c3b610a58271/pages",
            ),
            "tokyo-revengers": (
                set(range(1, 15)),
                "https://cdn.jsdelivr.net/gh/anon6968/tokyo-revengers-color-pages@de6d4b59eef25e07a824769b04d7ee3c9f72c3ed/pages",
            ),
            "yu-yu-hakusho": (
                set(range(1, 52)),
                "https://cdn.jsdelivr.net/gh/anon6968/yu-yu-hakusho-color-pages@f889b87234e5719f18bcea607e2712cf50a9bf22/pages",
            ),
        }
        for slug, (colored_units, image_base) in expected.items():
            self.assertEqual("partial", self.live[slug]["color"], slug)
            self.assertEqual(image_base, self.live[slug]["imageBase"], slug)
            self.assertEqual(
                colored_units,
                {c["chapter"] for c in manifest(slug)["chapters"] if c["type"] == "color"},
                slug,
            )

    def test_changed_chapter_files_are_exactly_the_approved_delta(self):
        expected_previous_release = {
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
        expected_current_release = {
            "dragon-ball-super": set(range(1, 105)),
            "undead-unluck": set(range(1, 71)),
            "made-in-abyss": {*range(1, 10), *range(47, 53)},
            "highschool-of-the-dead": set(range(1, 8)),
            "miss-kobayashis-dragon-maid": {2, 30, 31, 33, 43, 46, 54, 55, 62, 63, 81, 91},
            "tomo-chan-is-a-girl": set(range(1, 23)),
            "sand-land": set(range(1, 11)),
            "thus-spoke-rohan-kishibe": set(range(1, 13)),
            "to-love-ru-darkness": set(range(0, 78)),
            "dragon-ball-sd": set(range(1, 45)),
            "sakamoto-days": set(range(1, 8)),
            "tokyo-revengers": set(range(1, 15)),
            "yu-yu-hakusho": set(range(1, 52)),
            "hoshin-engi": {47, 48, 49},
            "shadows-house": {238},
        }
        expected = {**expected_previous_release, **expected_current_release}
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

    def test_every_current_production_url_is_preserved(self):
        baseline_bytes = CURRENT_BASELINE_URLS.read_bytes()
        self.assertEqual(
            CURRENT_BASELINE_SHA256,
            hashlib.sha256(baseline_bytes).hexdigest(),
        )
        lines = [
            line.strip()
            for line in baseline_bytes.decode().splitlines()
            if line.strip()
        ]
        self.assertEqual(18_406, len(lines))
        self.assertEqual(18_406, len(set(lines)))
        before = {line.rstrip("/") for line in lines}
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
