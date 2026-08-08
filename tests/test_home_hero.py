from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class HomeHeroTest(unittest.TestCase):
    def test_legends_assemble_is_the_home_hero(self):
        source = (ROOT / "app/page.tsx").read_text(encoding="utf-8")

        self.assertIn('src="/hero-legends-assemble.webp"', source)
        self.assertIn('alt="Colorized Manga heroes assembled in full color"', source)
        self.assertIn("priority", source)
        self.assertIn('className="grid w-full items-center overflow-hidden', source)
        self.assertIn(
            "xl:grid-cols-[max(1rem,calc((100vw-70rem)/2))_minmax(0,32.5rem)_minmax(0,1fr)]",
            source,
        )
        self.assertIn("xl:col-start-3 xl:row-start-1", source)
        self.assertNotIn('section className="mx-auto grid max-w-6xl', source)
        self.assertNotIn("md:grid-cols-[.94fr_1.06fr]", source)
        self.assertNotIn('import AnimatedLogo from "@/components/AnimatedLogo"', source)
        self.assertTrue((ROOT / "public/hero-legends-assemble.webp").is_file())

    def test_black_and_white_card_posters_are_not_forced_grayscale(self):
        source = (ROOT / "components/MangaCard.tsx").read_text(encoding="utf-8")
        poster_source = "manga.poster ?? pageUrl(manga, 1, 1)"
        source_position = source.index(poster_source)
        image_start = source.rindex("<img", 0, source_position)
        poster_image = source[image_start : source.index("/>", image_start)]

        self.assertIn(poster_source, poster_image)
        self.assertNotIn('manga.color === "none"', poster_image)
        self.assertNotIn('"grayscale"', poster_image)


if __name__ == "__main__":
    unittest.main()
