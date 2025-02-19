# Vefforritun 2, 2025, verkefni 2: Express, postgres og hýsing

## Markmið

- Setja upp express vef með routes, templateum og formum með staðfestingu
- Setja upp postgres gagnagrunn, vinna með skema og gögn sem til eru og bæta við þau
- Setja upp verkefni í hýsingu

## Verkefnið

Verkefnið er framhald á [verkefni 1](https://github.com/vefforritun/vef2-2025-v1) og snýst um að setja upp express vef með postgres gagnagrunni fyrir flokka og spurninga.

### Express vefur

Setja skal upp express vef með routes fyrir:

- Forsíðu, með hlekkjum á flokkasíður
- Flokkasíðu með spurningum
- Síðu með formi til að bæta við spurningu í flokk

Ef reynt er að fara á síðu sem er ekki til skal birta 404 villu.

Ef villa kemur upp skal birta villusíðu.

### Postgres gagnagrunnur og gögn

Setja skal upp postgres gagnagrunn og færa inn í hann gögn sem til eru í `data/` möppu (sömu og í verkefni 1).

Setja skal upp töflur fyrir flokka, spurningar og svör, með tengingum (foreign keys) milli þeirra.

Fylla skal í töflur með gögnum úr `data/` möppu, ekki er krafa um að forrita innsetningu (má útbúa bara SQL insert skipanir).

### Birting

Birta skal lista af flokkum á forsíðu, með hlekkjum á flokkasíður og á síðu til að búa til nýja spurningu.

Hver flokkasíða skal birta allar spurningar í flokknum með viðeigandi svörum. Þegar svar er valið skal vera leið til að sjá rétt svar. Hægt er að nota lausn úr verkefni 1 eða úr sýnilausn.

Á síðu til að bæta við spurningu skal vera form með eftirfarandi reitum:

- Spurning
- Flokkur, valið úr lista af öllum skráðum flokkum
- Svör, einhver leið til að útbúa og skrá svör ásamt leið til að merkja rétt svar

Staðfesta þarf gögnin, þið megið ákveða hvernig það er gert en að minnsta kosti:

- Spurning skal hafa lág- og hámark á lengd.
- Flokkur verður að vera til í gagnagrunni.
- Skilgreina þarf lágmarks og hámarks fjölda svara.
- Skilgreina þarf hvaða svar er rétt. Er það eingöngu eitt?

Ef gögn eru ekki á réttu formi skal birta villuskilaboð um það og hvað þarf að laga.

### Útlit

Setja skal upp _einfalt_ útlit á vefnum með flexbox eða grid. Takmarka heildarstærð og vera _responsive_. Nota má útlit úr verkefni 1 eða úr sýnilausn.

Forritið skal útbúa merkingarfræðilegt og aðgengilegt HTML með EJS sniðmátum.

### Öryggi

Huga þarf að öryggi:

- Skrá þarf gögn í gagngrunn með réttum hætti, nota parametrized queries
- XSS árásir skulu ekki vera mögulegar, nota skal `xss` pakka við skráningu á gögnum

### Tæki, tól og test

Nota skal node 22.

Nota skal NPM eða Yarn til að sækja og keyra tól.

Aðeins skal nota ECMAScript modules (ESM, `import` og `export`) og ekki CommonJS (`require`).

Breyta má út frá reglum sem eru settar upp í `eslint` með því að breyta stillingar (`rc` skrám) en það er ekki leyfilegt að slökkva á reglum í kóða.

Setja upp/endurnýta próf fyrir viðeigandi virkni með `jest`, `vitest` eða node test runner.

Setja skal upp GitHub actions í repo.

### GitHub og hýsing

Setja skal upp vefinn á Render, Railway eða Heroku (ath að uppsetning á Heroku mun kosta) tengt við GitHub með postgres settu upp.

## Mat

- 10% – Express uppsetning
- 20% – Postgres gagnagrunnur uppsettur og gögn sett inn
- 20% – Gögn sótt úr gagnagrunni og birt
- 20% – Gögn sett inn í gagnagrunn með staðfestingu
- 10% — Útlit
- 10% – Tæki, tól og test
- 10% – GitHub og hýsing

## Sett fyrir

Verkefni sett fyrir í fyrirlestri miðvikudaginn 5. febrúar 2025.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags fimmtudaginn 21. febrúar 2025.

Skil skulu innihalda:

- Slóð á verkefni keyrandi á Netlify.
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

> Útgáfa 0.1

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Fyrsta útgáfa |