# Vefforritun 2, 2025, verkefni 3: Vefþjónustur

## Markmið

- Setja upp RESTful „CRUD“ vefþjónustur með Hono.
- Nota Prisma til að vinna með gagnagrunn.
- Nota TypeScript.

## Verkefnið

Verkefnið er framhald á [verkefni 1](https://github.com/vefforritun/vef2-2025-v1) og [verkefni 2](https://github.com/vefforritun/vef2-2025-v2).

Það snýst um að setja upp vefþjónustur sem vinna með gögnin með [Hono](https://hono.dev/) ásamt því að nota [Prisma](https://www.prisma.io/) fyrir gagnagrunnsvinnsluna.

### Vefþjónustur

Setja skal upp Hono með „template“ fyrir Node.js og TypeScript. Vefþjónustur sem útfæra skal eru:

Fyrir gerðir:

- `GET /categories` skilar lista af flokkum:
  - `200 OK` skilað með gögnum á JSON formi.
  - `500 Internal Error` skilað ef villa kom upp.
- `GET /categories/:slug` skilar stökum flokki:
  - `200 OK` skilað með gögnum ef flokkur er til.
  - `404 Not Found` skilað ef flokkur er ekki til.
  - `500 Internal Error` skilað ef villa kom upp.
- `POST /category` býr til nýjan flokk:
  - `201 Created` (eða `200 OK` sem var áður hér) skilað ásamt upplýsingum um flokk.
  - `400 Bad Request` skilað ef gögn sem send inn eru ekki rétt (vantar gögn, gögn á röngu formi eða innihald þeirra ólöglegt).
  - `500 Internal Error` skilað ef villa kom upp.
- `PATCH /category/:slug` uppfærir flokk:
  - `200 OK` skilað með uppfærðum flokk ef gekk.
  - `400 Bad Request` skilað ef gögn sem send inn eru ekki rétt.
  - `404 Not Found` skilað ef flokkur er ekki til.
  - `500 Internal Error` skilað ef villa kom upp.
- `DELETE /category/:slug` eyðir flokk:
  - `204 No Content` skilað ef gekk.
  - `404 Not Found` skilað ef flokkur er ekki til.
  - `500 Internal Error` skilað ef villa kom upp.

Skilgreina þarf (líkt og fyrir gerðir) vefþjónustur til að geta:

- Skoðað spurningar.
- Skoða spurningar eftir flokk.
- Búa til spurningu.
- Breyta spurningu.
- Eyða spurningu.

Það er ákvörðun í útfærslu hvernig spurningar og spurningar eftir flokk eru aðskildar; og hvort spurningar og svör séu aðskilin eða ekki.

### Gögn

Nota skal Prisma til að vinna með gögnin. Gögnin eru eins og í verkefni 2. Ekki þarf að láta gagnagrunn innihalda gögn í byrjun en ef það er gert skal skoða [`Seeding` með Prisma](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding).

Fyrir staðfestingu gögnum væri hægt að nota [Zod, sjá skjölun í Hono](https://hono.dev/docs/guides/validation#with-zod).

Ef verkefni 2 var hýst á Render getur verið að ekki sé hægt að útbúa annan gagnagrunn, þá er hægt að nota aðra hýsingu eða sérstaka gagnagrunnshýsingu, t.d. [Neon](https://neon.tech/).

### TypeScript

Nota skal TypeScript í verkefninu í gegnum uppsetningu í Hono.

Nota skal týpur með `type` og skilgreina á öll föll. Ekki skal nota `any` týpur. Forðast ætti að nota `as` lykilorðið til að varpa gögnum yfir í týpu.

### Öryggi

Huga þarf að öryggi:

- Skrá þarf gögn í gagngrunn með réttum hætti, nota parametrized queries
- XSS árásir skulu ekki vera mögulegar, nota skal `xss` pakka við skráningu á gögnum

### Tæki, tól og test

Nota skal node 22.

Nota skal NPM eða Yarn til að sækja og keyra tól.

Aðeins skal nota ECMAScript modules (ESM, `import` og `export`) og ekki CommonJS (`require`).

Nota skal `eslint` fyrir linting.

Setja upp/endurnýta próf fyrir viðeigandi virkni með `jest`, `vitest` eða node test runner.

Setja skal upp GitHub actions í repo.

### GitHub og hýsing

Setja skal upp vefinn á Render eða einhverri annari hýsingu (sjá Hono hýsingarmöguleika í skjölun), tengt við GitHub með postgres settu upp.

## Mat

- 40% — Vefþjónustur útfærðar með Hono.
- 30% — Unnið með gögn, þau staðfest, hugað að öryggi og vistuð í postgres grunni gegnum Prisma.
- 20% — TypeScript notað.
- 10% — Tæki, tól og test, verkefni sett upp í hýsingu.

## Sett fyrir

Verkefni sett fyrir með tilkynningu miðvikudaginn 19. febrúar 2025.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags fimmtudaginn 6. mars 2025.

Skil skulu innihalda:

- Slóð á verkefni keyrandi.
- Slóð á GitHub repo fyrir verkefni. Dæmatímakennurum skal hafa verið boðið í repo. Notendanöfn þeirra eru:
  - `osk`
  - `ofurtumi`
  - `tomasblaer`

## Einkunn

Leyfilegt er að ræða, og vinna saman að verkefni en **skrifið ykkar eigin lausn**. Ef tvær eða fleiri lausnir eru mjög líkar þarf að færa rök fyrir því, annars munu allir hlutaðeigandi hugsanlega fá 0 fyrir verkefnið.

Ef stórt mállíkan (LLM, „gervigreind“, t.d. ChatGTP) er notað til að skrifa part af lausn skal taka það fram. [Sjá nánar á upplýsingasíða um gervigreind hjá HÍ](https://gervigreind.hi.is/).

Sett verða fyrir ([sjá nánar í kynningu á áfanga](https://github.com/vefforritun/vef2-2025/blob/main/namsefni/01.kynning/1.kynning.md)):

- fimm minni sem gilda 10% hvert, samtals 50% af lokaeinkunn.
- tvö hópverkefni þar sem hvort um sig gildir 20%, samtals 40% af lokaeinkunn.
- einstaklingsverkefni sem gildir 15–25% af lokaeinkunn.

---

> Útgáfa 0.5

| Útgáfa | Breyting         |
| ------ | ---------------- |
| 0.1    | Fyrsta útgáfa    |
| 0.2    | Bæta við um Neon |
| 0.3    | Laga `201` fyrir þegar flokkur búinn til; bæta við um seeding; laga skilgreiningar á þjónustum fyrir spurningar |
| 0.4    | Bæta við að þurfa að eyða spurningu |
| 0.5    | Taka út að skila þurfi á Netlify |