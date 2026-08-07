# Landing-page catalog — visibility status

_Last updated: 2026-08-07_

The site's live catalog is trimmed to widely recognizable (big + medium) series. Less-popular long-tail titles are **hidden** — still in the repo (`web/data/auto-series.json`, images on their CDNs / GitHub), but flagged `"hidden": true` so they're filtered out of `MANGAS` and disappear from the grid, schema, sitemap, feed, and their routes 404.

To bring one back: set `"hidden": false` (or delete the key) on its entry in `web/data/auto-series.json` and rebuild.

## Hidden / removed from the site (14)

| Title | Slug | Why hidden |
|---|---|---|
| Dòupò Cāngqióng | `battle-through-the-heavens` | Chinese web-manhua/donghua (Dou Po Cang Qiong) — huge in China, little recognition with a Western manga audience. |
| Canvas 2 ~Rainbow colored sketch~ | `canvas-2-rainbow-colored-sketch` | Obscure romance / visual-novel tie-in — almost no recognition. |
| Hoshin Engi | `hoshin-engi` | Older Japanese series — low present-day recognition. |
| I Am the Sorcerer King | `i-am-the-sorcerer-king` | Korean manhwa — niche. |
| Martial Universe | `martial-universe` | Chinese web-novel manhua — niche outside China. |
| Peerless Battle Spirit | `peerless-battle-spirit` | Chinese web-manhua — niche. |
| Sokushi Cheat ga Saikyou Sugite, Isekai no Yatsura ga Marude Aite ni Naranai n desu ga | `sokushi-cheat-ga-saikyou-sugite-isekai-n` | Obscure isekai — low recognition. |
| Dou Luo Da Lu | `soul-land` | Dou Luo Da Lu — big donghua in China, niche in the West. |
| Spirit Sword Sovereign | `spirit-sword-sovereign` | Chinese web-manhua — niche. |
| The Breaker | `the-breaker` | Korean manhwa — a cult classic but low mainstream recognition. |
| The Great Ruler | `the-great-ruler` | Chinese web-novel manhua — niche. |
| Versatile Mage | `versatile-mage` | Chinese donghua/manhua — large in China, niche in the West. |
| When Will Ayumu Make His Move? | `when-will-ayumu-make-his-move` | Niche romcom — small audience. |
| Yandere ka to Omottara Motto Yabe Onna Datta | `yandere-ka-to-omottara-motto-yabe-onna-d` | Obscure title — minimal recognition. |

**Borderline calls (big Asian followings — easy to restore if you want them back):** `the-breaker`, `soul-land`, `battle-through-the-heavens`, `versatile-mage`.

## Kept from the auto-imported set (14)

These stayed because they're globally recognizable classics/franchises:

- Akira (`akira`)
- Dragon Ball (`dragon-ball`)
- JoJo no Kimyou na Bouken Dai-9-bu: The JOJOLands Color-ban (`jojo-no-kimyou-na-bouken-dai-9-bu-the-jo`)
- JoJo no Kimyou na Bouken: Part 1 - Phantom Blood Color-ban (`jojo-no-kimyou-na-bouken-part-1-phantom-`)
- JoJo no Kimyou na Bouken: Part 2 - Sentou Chouryuu Color-ban (`jojo-no-kimyou-na-bouken-part-2-sentou-c`)
- JoJo no Kimyou na Bouken: Part 3 - Stardust Crusaders Color-ban (`jojo-no-kimyou-na-bouken-part-3-stardust`)
- JoJo no Kimyou na Bouken: Part 4 - Diamond wa Kudakenai Color-ban (`jojo-no-kimyou-na-bouken-part-4-diamond-`)
- JoJo no Kimyou na Bouken: Part 5 - Ougon no Kaze Color-ban (`jojo-no-kimyou-na-bouken-part-5-ougon-no`)
- JoJo no Kimyou na Bouken: Part 6 - Stone Ocean Color-ban (`jojo-no-kimyou-na-bouken-part-6-stone-oc`)
- JoJo no Kimyou na Bouken: Part 7 - Steel Ball Run Color-ban (`jojo-no-kimyou-na-bouken-part-7-steel-ba`)
- JoJo no Kimyou na Bouken: Part 8 - JoJolion Color-ban (`jojo-no-kimyou-na-bouken-part-8-jojolion`)
- JoJo's Bizarre Adventure Part 9 - The JOJOLands (Fan-Colored) (`jojo-s-bizarre-adventure-part-9-the-jojo`)
- Oemo Jisangjuui (`lookism`)
- Shadows House (`shadows-house`)

_Note: the hand-authored catalog remains live. The 2026-08-07 release adds Parasyte and DARLING in the FRANXX and upgrades eight existing popular franchises to verified color coverage. No B&W title or production URL was removed: the removal-evidence audit approved none, so preserving indexed routes took priority over estimated file savings._

The 9 JoJo part entries were kept (major franchise) but are flagged internally as a cleanup candidate — they clutter the grid with long romaji names and could be consolidated later.
