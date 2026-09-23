# Petra Pokorná — realitní web

Vícestránkový responzivní web podle schváleného návrhu. Samostatné HTML stránky jsou čitelné a odkazovatelné bez JavaScriptu; klientské skripty přidávají filtrování, galerie, kalkulačku a přípravu kontaktní zprávy.

## Spuštění

```sh
npm run build
npm run dev
```

Náhled běží na http://127.0.0.1:4317. `npm run check` ověří interní odkazy, soubory a klíčové případy hypotečního výpočtu. Projekt nemá závislosti z npm.

## Obsah a změny

- `src/style.css`: vzhled a responzivita.
- `src/shared.mjs`: hlavička, patička a společné prvky.
- `src/pages.mjs`: podstránky a detaily nabídek.
- `src/articles.mjs`: texty poradny, připravené pro tento návrh.
- `src/app.js`: ovládání webu.
- `src/mortgage.js`: čistý anuitní výpočet.
- `content/properties.json`: tři nabídky s přesnými parametry a seznamy fotografií.
- `content/reviews.json`: převzaté reference klientů.
- `dist/`: kompletní publikovatelný web včetně 114 fotografií, portrétu a lokálně hostovaných fontů.

Po úpravách spusťte `npm run build`. Soubor `.openai/hosting.json` váže projekt na Sites. Výstup `dist/` je zároveň přenositelný na jiný statický hosting podporující adresáře s index.html a vlastní 404.html.

## GitHub Pages

Workflow `.github/workflows/pages.yml` při každém pushi do `main` sestaví a ověří web a publikuje pouze `dist/`. Lze jej spustit i ručně v záložce Actions. V Settings → Pages je zdrojem **GitHub Actions**.

Základní cestu workflow načítá z nastavení Pages: `/pokornapetra.cz` pro adresu `https://poracanin.github.io/pokornapetra.cz/`, prázdnou cestu pro případnou vlastní doménu. Odkazy, galerie, obrázky a fonty se při sestavení automaticky přizpůsobí. Doména `pokornapetra.cz` zatím není připojená.

Lokální ověření verze pro podadresář:

```sh
SITE_BASE_PATH=/pokornapetra.cz npm run build
SITE_BASE_PATH=/pokornapetra.cz npm run check
npm run build # obnoví běžný lokální výstup pro kořen domény
```

## Kontakty a provoz

Formulář validuje vstupy a sestaví skutečný mailto odkaz na petra.pokorna@bidli.cz. Zprávu návštěvník odešle ve své e-mailové aplikaci; k dispozici je také kopírování. Neexistuje falešné potvrzení o doručení. Web neposílá e-maily ze serveru a neobsahuje databázi poptávek. Přímé odesílání z webu by vyžadovalo zvolenou e-mailovou službu a její provozní přístup.

Ceny a nabídky odpovídají dodanému snímku z 23. 9. 2026; automatická synchronizace s BIDLI není zapojená. Původní fotografie a jejich vodoznaky jsou zachované. U bytu na Proseku je viditelně označen virtuální home staging. Při veřejném spuštění je vhodné redakčně potvrdit texty poradny a aktuálnost nabídek.

Kalkulačka pracuje s konstantní roční sazbou a anuitní měsíční splátkou. Zohledňuje nulový úrok i nulový úvěr, odmítá neplatná čísla a zahrnuje součet splátek a úroků. Nezahrnuje poplatky, pojištění ani změny sazby. WebMCP používá shodný výpočet i viditelný stav.

Web nepoužívá analytiku, reklamní skripty ani vlastní cookies. Fonty se načítají lokálně. Mapa a virtuální prohlídka se otevírají až kliknutím na příslušný externí odkaz.
