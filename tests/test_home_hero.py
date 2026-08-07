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


if __name__ == "__main__":
    unittest.main()
