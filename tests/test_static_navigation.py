import unittest
from pathlib import Path


WEB = Path(__file__).resolve().parents[1]
SOURCE_DIRS = (WEB / "app", WEB / "components", WEB / "lib")


def source_files():
    return sorted(
        path
        for directory in SOURCE_DIRS
        for path in directory.rglob("*.tsx")
    )


class StaticNavigationTests(unittest.TestCase):
    def test_static_export_does_not_use_next_link(self):
        offenders = []
        for path in source_files():
            if 'from "next/link"' in path.read_text():
                offenders.append(path.relative_to(WEB).as_posix())

        self.assertEqual(
            offenders,
            [],
            "Next Link requests RSC payloads that the Cloudflare artifact cannot host",
        )

    def test_internal_route_changes_do_not_use_app_router_push(self):
        offenders = []
        for path in source_files():
            source = path.read_text()
            if "router.push(" in source:
                offenders.append(path.relative_to(WEB).as_posix())

        self.assertEqual(
            offenders,
            [],
            "router.push requests stripped RSC payloads before falling back to HTML",
        )

    def test_legacy_apple_touch_icon_aliases_redirect_to_the_existing_icon(self):
        redirects = (WEB / "public" / "_redirects").read_text().splitlines()
        aliases = (
            "/apple-touch-icon-precomposed.png",
            "/apple-touch-icon-120x120.png",
            "/apple-touch-icon-120x120-precomposed.png",
            "/apple-touch-icon-152x152.png",
            "/apple-touch-icon-152x152-precomposed.png",
        )

        for alias in aliases:
            with self.subTest(alias=alias):
                self.assertIn(f"{alias} /apple-touch-icon.png 301", redirects)


if __name__ == "__main__":
    unittest.main()
