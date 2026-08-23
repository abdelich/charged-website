/**
 * Charged Development — language switching (English default, Swedish alternative).
 *
 * English lives in the markup, so only the Swedish dictionary is stored here. The
 * original English content of every translatable node is captured on first run and
 * restored when the visitor switches back, which keeps the two languages in sync
 * without duplicating the English copy in two places.
 *
 * Markup contract:
 *   data-i18n="key"             → element innerHTML
 *   data-i18n-content="key"     → content attribute (meta tags)
 *   data-i18n-aria-label="key"  → aria-label attribute
 *   data-i18n-title="key"       → title attribute
 */
(function () {
  "use strict";

  var STORAGE_KEY = "charged.lang";
  var DEFAULT_LANG = "en";
  var SUPPORTED = ["en", "sv"];

  var ATTRIBUTE_BINDINGS = [
    { dataKey: "i18nContent", attribute: "content" },
    { dataKey: "i18nAriaLabel", attribute: "aria-label" },
    { dataKey: "i18nTitle", attribute: "title" }
  ];

  var sv = {
    "meta.title": "Charged Development — mjukvara, data och automation | Sverige",
    "meta.description": "Charged Development — ett Stockholmsbaserat teknikbolag som bygger mjukvara, dataflöden och automation som tar bort manuellt arbete. 18 projekt sedan 2019.",
    "meta.ogDescription": "Vi bygger mjukvara, dataflöden och automation som tar bort manuellt arbete. Baserade i Stockholm, med kunder över hela världen.",

    "a11y.skip": "Hoppa till innehållet",
    "a11y.brandHome": "Charged Development startsida",
    "a11y.mainNav": "Huvudmeny",
    "a11y.footerNav": "Sidfot",
    "a11y.language": "Språk",
    "a11y.openMenu": "Öppna menyn",
    "a11y.filterGroup": "Filtrera projekt efter kategori",

    "brand.tagline": "Stockholm, Sverige",

    "nav.services": "Tjänster",
    "nav.work": "Våra projekt",
    "nav.process": "Så arbetar vi",
    "nav.about": "Om oss",
    "nav.faq": "Vanliga frågor",

    "cta.book": "Boka ett kostnadsfritt samtal",
    "cta.seeWork": "Se våra projekt",
    "cta.startStep1": "Börja med steg 1",
    "cta.askUs": "Fråga oss",

    "hero.badge": "Stockholm, Sverige · Kunder över hela världen",
    "hero.title": "Fixa långsamma processer.<br><em>Bygg mjukvara som lönar sig.</em>",
    "hero.lead": "Charged Development bygger mjukvaran, dataflödena och automationen som tar bort det manuella arbetet från ert team — från första samtalet till långsiktig förvaltning. Tydlig omfattning, mätbara resultat, inga svarta lådor.",
    "hero.directLabel": "Vill ni hellre prata direkt?",
    "hero.fact1": "levererade projekt",
    "hero.fact2": "verksamma sedan",
    "hero.fact3Term": "Globalt",
    "hero.fact3": "helt distansbaserat team",
    "hero.panelTitle": "Senaste resultaten",
    "hero.result1": "bättre prognosträffsäkerhet för en säljanalysplattform",
    "hero.result2": "OCR-träffsäkerhet som ersatte manuell dokumentregistrering",
    "hero.result3": "snabbare dokumenthantering, noll borttappade dokument",
    "hero.result4": "kortare videoproduktion med finjusterade neurala nätverk",
    "hero.allProjects": "Alla 18 projekt",
    "hero.trustLabel": "Utvalda kunder",
    "hero.trustNda": "samt sekretessbelagda uppdrag för privata bolag",

    "services.label": "Tjänster",
    "services.title": "Mjukvara, data och automation — tre sätt vi hjälper er framåt",
    "services.intro": "Systemutveckling, dataanalys och automatisering av affärsprocesser — vi utgår från resultat, inte modeord. Berätta vad som är långsamt, manuellt eller oklart, så föreslår vi en praktisk väg framåt.",
    "services.ctaText": "Osäkra på vilken av dem ni behöver? Det är precis vad det första samtalet är till för.",
    "services.build.title": "Bygga — skräddarsydd systemutveckling",
    "services.build.body": "Skräddarsydda webb- och mobilapplikationer, MVP:er och dedikerad produktsupport, så att ert team kan fokusera på affären.",
    "services.build.item1": "Skräddarsydd mjukvaru- och systemutveckling",
    "services.build.item2": "Webbutveckling och apputveckling",
    "services.build.item3": "MVP-utveckling och modernisering av äldre system",
    "services.build.item4": "Outsourcad produktutveckling och support",
    "services.build.outcome": "Leverans i tid, med ett team som stannar kvar efter lansering.",
    "services.data.title": "Data och AI — från rådata till beslut",
    "services.data.body": "Koppla ihop era system, automatisera repetitivt arbete och använd maskininlärning där den faktiskt gör nytta.",
    "services.data.item1": "Dataanalys, dashboards och beslutsstöd (BI)",
    "services.data.item2": "Dataingenjörskap och integrationsflöden",
    "services.data.item3": "Maskininlärning och prediktiv modellering",
    "services.data.item4": "Datorseende, OCR och dokumenttolkning",
    "services.data.item5": "Automatisering av affärsprocesser och RPA",
    "services.data.item6": "Dataannotering för AI och ML",
    "services.data.outcome": "Beslut som bygger på data, inte gissningar.",
    "services.advise.title": "Rådgivning och skalning — IT-konsult och outsourcing",
    "services.advise.body": "Klarhet innan ni investerar, och extra kapacitet när ni behöver den.",
    "services.advise.item1": "IT-rådgivning och tekniska granskningar",
    "services.advise.item2": "Dedikerade utvecklingsteam och konsultförstärkning",
    "services.advise.item3": "Nearshore-utveckling från Sverige",
    "services.advise.item4": "Flexibla partnerskap för outsourcad utveckling",
    "services.advise.outcome": "Från en enskild granskning till ett långsiktigt utvecklingsteam — i er takt och inom er budget.",

    "work.label": "Våra projekt",
    "work.title": "18 projekt. Mätbara resultat.",
    "work.intro": "Varje projekt nedan är verkligt arbete som levererats till en kund — mål, lösning, resultat. Maskininlärning, automation, dataanalys och skräddarsydd systemutveckling, där kundnamn utelämnas när sekretessavtal gäller. Filtrera efter den typ av problem ni vill lösa.",
    "work.filterAll": "Alla",
    "work.goal": "Mål",
    "work.solution": "Lösning",
    "work.result": "Resultat",
    "work.showAll": "Visa alla {count} projekt",
    "work.showFewer": "Visa färre projekt",
    "work.note": "Vill ni veta mer om något av dem? Fråga oss på introsamtalet.",
    "work.noteLink": "Boka ett nu →",

    "tag.ai": "AI och maskininlärning",
    "tag.automation": "Automation",
    "tag.software": "Mjukvara och plattformar",
    "tag.data": "Data och analys",

    "case.sales.metric": "+35 % träffsäkerhet",
    "case.sales.title": "Säljanalysplattform med prognoser",
    "case.sales.goal": "Analysera försäljningen och prognostisera efterfrågan.",
    "case.sales.solution": "Webbplattform med dashboards, ML-baserade prognoser och rapportering i realtid.",
    "case.sales.result": "Prognosernas träffsäkerhet ökade med 35 %.",

    "case.ocr.metric": "97 % träffsäkerhet",
    "case.ocr.title": "OCR-tolkning av dokument med kyrillisk text",
    "case.ocr.goal": "Automatisera dataregistrering från dokument skrivna med kyrilliska tecken.",
    "case.ocr.solution": "CRNN-modell med EfficientNet-B3 och en egen ordlista, finjusterad för hög träffsäkerhet.",
    "case.ocr.result": "97 % träffsäkerhet och kraftigt minskade kostnader för manuell registrering.",

    "case.docflow.metric": "60 % snabbare",
    "case.docflow.title": "Automatiserat dokumentflöde med AI-analys",
    "case.docflow.goal": "Snabba upp hanteringen av inkommande dokument.",
    "case.docflow.solution": "AI-driven tolkning, klassificering och vidarebefordran av varje dokument som kommer in.",
    "case.docflow.result": "60 % snabbare hantering och noll borttappade dokument.",

    "case.video.metric": "70 % snabbare",
    "case.video.title": "Neurala nätverk för videopersonalisering",
    "case.video.goal": "Automatisera ansiktsbyte i video med hög kvalitet för personaliserad marknadsföring.",
    "case.video.solution": "Finjusterade GAN- och autoencodermodeller i en säker pipeline, med efterbearbetning för sändningskvalitet.",
    "case.video.result": "Videoproduktionstiden minskade med 70 %, med bibehållen professionell kvalitet.",

    "case.crm.metric": "+20 % konvertering",
    "case.crm.title": "CRM-system för en reklambyrå",
    "case.crm.goal": "Samla sälj- och marknadsprocesserna på ett ställe.",
    "case.crm.solution": "Skräddarsytt CRM med ärendehantering, e-postintegration och kampanjanalys.",
    "case.crm.result": "Konverteringsgraden för leads ökade med 20 %.",

    "case.maintenance.metric": "25 % färre reparationer",
    "case.maintenance.title": "Prediktivt underhåll av utrustning",
    "case.maintenance.goal": "Minska oplanerade haverier i utrustningen.",
    "case.maintenance.solution": "ML-plattform som analyserar sensordata och förutser haverier innan de inträffar.",
    "case.maintenance.result": "Akuta reparationer minskade med 25 %.",

    "case.diagnostics.metric": "20 min till 4 min",
    "case.diagnostics.title": "Automatiserad PC-diagnostik med PDF-rapport",
    "case.diagnostics.goal": "Snabba upp det tekniska underhållet av företagets datorpark.",
    "case.diagnostics.solution": "Skrivbordsapp som samlar in hård- och mjukvarudata, bygger en strukturerad PDF-rapport och mejlar den automatiskt.",
    "case.diagnostics.result": "Diagnostiktiden minskade från 20 till 4 minuter per enhet.",

    "case.toolkit.metric": "45 % snabbare",
    "case.toolkit.title": "Universell IT-verktygslåda för systemanalys",
    "case.toolkit.goal": "Ge IT-teamet ett enda verktyg för diagnostik och övervakning av utrustning.",
    "case.toolkit.solution": "Skrivbordsapp med prestandatester, diskanalys och hårdvaruövervakning i realtid.",
    "case.toolkit.result": "Felsökningen gick 45 % snabbare.",

    "case.vpn.metric": "Ingen manuell installation",
    "case.vpn.title": "Central utrullning av VPN-certifikat",
    "case.vpn.goal": "Rulla ut säker VPN-åtkomst över flera kontor.",
    "case.vpn.solution": "Automatiserad certifikatinstallation med central styrning, loggning och statusövervakning.",
    "case.vpn.result": "Manuella handhavandefel försvann och hela processen automatiserades.",

    "case.monitoring.metric": "40 % mindre driftstopp",
    "case.monitoring.title": "Hårdvaruövervakning med e-postlarm",
    "case.monitoring.goal": "Minimera driftstopp orsakade av överhettning och hårdvarufel.",
    "case.monitoring.solution": "Programvara som följer temperatur, CPU-belastning och diskhälsa och larmar personalen vid kritiska nivåer.",
    "case.monitoring.result": "Antalet driftstopp minskade med 40 %.",

    "case.translator.metric": "Helt offline",
    "case.translator.title": "Lokal offline-översättare för säkra miljöer",
    "case.translator.goal": "Översätta känsliga dokument utan internetuppkoppling.",
    "case.translator.solution": "Neural översättningsmodell på enheten, optimerad för svagare datorer, med säkra offline-ordlistor.",
    "case.translator.result": "Säker översättning inom isolerade nätverk och betydligt kortare tid per dokument.",

    "case.news.metric": "3–4 timmar sparade dagligen",
    "case.news.title": "Nyhetsaggregator med Telegram-bot och analys",
    "case.news.goal": "Automatisera nyhetsinsamling och publicering för ett mediebolag.",
    "case.news.solution": "Bot som samlar nyheter från RSS-flöden och Telegram-kanaler, redigerar och publicerar innehåll och rapporterar statistik till Google Sheets.",
    "case.news.result": "Tre till fyra timmars redaktionellt arbete sparas varje dag.",

    "case.printer.metric": "60 % snabbare",
    "case.printer.title": "Virtuell skrivare för vården",
    "case.printer.goal": "Standardisera och automatisera framtagningen av medicinska rapporter.",
    "case.printer.solution": "Virtuell skrivardrivrutin som lägger på den grafiska profilen automatiskt och mejlar det färdiga dokumentet.",
    "case.printer.result": "Tiden för att ta fram dokument minskade med 60 %.",

    "case.construction.metric": "Snabbare rapportering",
    "case.construction.title": "Processanalys för ett byggföretag",
    "case.construction.goal": "Effektivisera order- och resurshanteringen.",
    "case.construction.solution": "Databas och CRM-system med inbyggd analys.",
    "case.construction.result": "Snabbare rapportering och märkbart bättre projektplanering.",

    "case.auction.metric": "Större räckvidd",
    "case.auction.title": "Auktionsplattform med produktklassificering",
    "case.auction.goal": "Bygga en e-handelsplattform med auktionsfunktioner.",
    "case.auction.solution": "ASP.NET Core MVC-system med ML-baserad produktklassificering och objekthantering.",
    "case.auction.result": "Större kundräckvidd och en effektivare säljprocess.",

    "case.industrial.metric": "92 %+ träffsäkerhet",
    "case.industrial.title": "Klassificering av industriobjekt",
    "case.industrial.goal": "Klassificera industrianläggningar utifrån deras nyckelegenskaper.",
    "case.industrial.solution": "Random forest- och beslutsträdsmodeller tränade på verkliga driftdata.",
    "case.industrial.result": "Klassificeringens träffsäkerhet över 92 %.",

    "case.camera.metric": "Snabbare arkivering",
    "case.camera.title": "System för kamerafångst och bildbehandling",
    "case.camera.goal": "Bygga ett verktyg för fotodokumentation och statusanalys av utrustning.",
    "case.camera.solution": "WPF-applikation med AForge.NET, beskärningsverktyg och automatisk bildkomprimering.",
    "case.camera.result": "Bildfångst och arkivering för intern övervakning blev rutin.",

    "case.agents.metric": "Infört av designteamet",
    "case.agents.title": "Agentsystem för designers",
    "case.agents.goal": "Ge designers en snabbare bildsökning med personaliserat resultat.",
    "case.agents.solution": "Agentbaserat system byggt på LangGraph och LangChain, med integrationer mot OpenAI och Google API och en vektordatabas med embeddings.",
    "case.agents.result": "Infördes av designteamet och förbättrade både kvaliteten och tempot i vardagen.",

    "clients.label": "Vilka vi hjälper",
    "clients.title": "För företag som vill ha resultat, inte presentationer",
    "clients.intro": "Vi arbetar med koncerner, små och medelstora företag och växande bolag över hela världen — som IT-konsultpartner, som dedikerat utvecklingsteam eller båda. De flesta kunder kommer till oss med något av dessa tre problem.",
    "clients.one.title": "Analys och automation",
    "clients.one.body": "Er data ligger i separata system och era processer bygger fortfarande på manuellt arbete. Vi bygger flödena, dashboarderna och automationen som gör verksamheten mätbar.",
    "clients.two.title": "Produktivitet genom IT",
    "clients.two.body": "Ni vill ha färre flaskhalsar och snabbare beslut. Vi bygger verktyg som passar hur ert team redan arbetar, och visar nyttan tidigt i stället för i slutet.",
    "clients.three.title": "IT-outsourcing och dedikerade team",
    "clients.three.body": "Ni behöver kompetens utan att anställa ett helt internt team. Vi arbetar som en förlängning av er verksamhet — transparent, flexibelt och lätt att skala upp eller ner.",

    "process.label": "Så arbetar vi",
    "process.title": "Tydliga steg. Inga överraskningar.",
    "process.intro": "Varje uppdrag börjar med ett kostnadsfritt introsamtal. Vi går igenom era behov tillsammans innan något betalt arbete påbörjas.",
    "process.ctaText": "Steg ett tar 30 minuter och kostar ingenting.",
    "process.step1.title": "Introsamtal",
    "process.step1.body": "Ni beskriver problemet, målen och förutsättningarna. Vi lyssnar och ställer rätt frågor.",
    "process.step1.out": "Kostnadsfritt · utan förbindelse",
    "process.step2.title": "Behov och omfattning",
    "process.step2.body": "Vi klargör krav, system, data och hur resultatet ska mätas.",
    "process.step2.out": "Upplägg, tidplan och budgetspann",
    "process.step3.title": "Offert och avtal",
    "process.step3.body": "Fast pris, löpande räkning eller retainer — det som passar projektet.",
    "process.step3.out": "Undertecknad plan och startdatum",
    "process.step4.title": "Bygga och iterera",
    "process.step4.body": "Utveckling i tydliga faser med regelbundna avstämningar, varje vecka eller varannan.",
    "process.step4.out": "Fungerande mjukvara, ingen svart låda",
    "process.step5.title": "Lansering och support",
    "process.step5.body": "Överlämning, dokumentation, buggfixar och löpande support om ni vill.",
    "process.step5.out": "En stabil lösning med utrymme att växa",

    "about.label": "Om oss",
    "about.title": "Ett litet team som rör sig snabbt",
    "about.intro": "Charged Development — ofta bara kallat Charged — är ett svenskt teknikbolag och internationellt IT-outsourcingteam med huvudkontor i Stockholm. Vi startade 2019 och relanserade som internationellt bolag 2023. Vi arbetar helt på distans, och därför har geografin aldrig begränsat vilka vi kan arbeta med.",
    "about.whyTitle": "Varför arbeta med oss",
    "about.why1": "<strong>Snabbhet</strong> — snabb start, oftast inom 2–5 arbetsdagar från avtal",
    "about.why2": "<strong>Kvalitet</strong> — beprövad teknik, grundlig testning och garantitid",
    "about.why3": "<strong>Flexibilitet</strong> — vi anpassar oss till era krav och er budget",
    "about.why4": "<strong>Global räckvidd</strong> — helt på distans, inga geografiska gränser",
    "about.why5": "<strong>Redo för NDA</strong> — vana vid konfidentiella uppdrag och företagsprojekt",
    "about.founderRole": "Grundare, Charged Development",
    "about.techTitle": "Teknik vi arbetar med",
    "about.techIntro": "Vi väljer den teknik som passar varje projekt bäst. Vår erfarenhet omfattar:",
    "about.techBackend": "Backend",
    "about.techFrontend": "Frontend",
    "about.techMl": "ML och AI",
    "about.techAnalytics": "Analys",
    "about.techData": "Data",
    "about.techCloud": "Moln",
    "about.techNote": "Arbetar ni med något annat? Vi sätter oss snabbt in i ny teknik — säg bara till på samtalet.",

    "faq.label": "Vanliga frågor",
    "faq.title": "Frågorna kunder ställer först",
    "faq.ctaText": "Har ni fortfarande en fråga? Ställ den direkt — vi svarar inom 1–2 arbetsdagar.",
    "faq.q1": "Hur snabbt kan ni börja?",
    "faq.a1": "Oftast inom 2–5 arbetsdagar efter avtal, och snabbare vid brådskande projekt.",
    "faq.q2": "Hur stort är ert team?",
    "faq.a2": "En liten fast kärna av utvecklare, med ett upparbetat nätverk av specialister som vi tar in per projekt. Alla har högskoleutbildning, certifieringar och verklig leveranserfarenhet — och teamet skalas efter uppdraget i stället för tvärtom.",
    "faq.q3": "Vad kostar det?",
    "faq.a3": "Det beror på omfattning och komplexitet. Vi arbetar antingen till fast pris eller timpris, med bättre villkor för långsiktiga kunder. Ni får ett budgetspann innan ni binder er till något.",
    "faq.q4": "Garanterar ni kvaliteten?",
    "faq.a4": "Ja. Vi använder beprövad teknik, testar grundligt och lämnar garantitid på levererat arbete. SLA-baserad support finns om ni behöver det.",
    "faq.q5": "Arbetar ni under sekretessavtal?",
    "faq.a5": "Ja, undertecknas på begäran. En stor del av vår portfölj är konfidentiella uppdrag för privata bolag.",
    "faq.q6": "Vad händer efter lansering?",
    "faq.a6": "Ni får överlämning och dokumentation, plus valfritt löpande underhåll och vidareutveckling enligt separat avtal.",
    "faq.q8": "Är Charged samma bolag som Charged Development?",
    "faq.a8": "Ja. Charged Development är vårt fullständiga namn, och det förkortas på alla möjliga sätt — Charged, Charged Tech, Charged Sweden. Det är ett och samma team, baserat i Stockholm, Sverige, med en enda webbplats: chargeddata.com.",
    "faq.q7": "Vilka länder arbetar ni i?",
    "faq.a7": "Bolaget är registrerat i Sverige och arbetar helt på distans. Vi har levererat projekt i Europa, Nordamerika, Ukraina och på andra håll — det finns inga geografiska begränsningar.",

    "contact.label": "Kontakt",
    "contact.title": "Berätta vad ni behöver",
    "contact.intro": "Fyll i formuläret så återkommer vi för att boka ett kostnadsfritt introsamtal. Ju mer sammanhang ni delar, desto bättre förberedda är vi.",
    "contact.getInTouch": "Kontakta oss",
    "contact.emailUs": "Mejla oss",
    "contact.callUs": "Ring oss",
    "contact.location": "Plats",
    "contact.locationValue": "Stockholm, Sverige — vi arbetar globalt",
    "contact.next": "Så går det till",
    "contact.next1": "Vi läser er förfrågan och svarar via e-post",
    "contact.next2": "Kostnadsfritt introsamtal för att gå igenom behovet",
    "contact.next3": "Skriftligt upplägg, tidplan och budgetspann",
    "contact.note": "Vi svarar normalt inom 1–2 arbetsdagar. Det första introsamtalet är kostnadsfritt och utan förbindelse. Seriösa företagsförfrågningar är välkomna från hela världen.",
    "contact.formLede": "Fyra fält och en kryssruta är allt vi behöver. Resten är valfritt — samtalet fyller i luckorna.",
    "contact.aboutYou": "Om er",
    "contact.whatNeed": "Vad behöver ni?",
    "contact.contextTitle": "Lägg till projektbakgrund",
    "contact.contextHint": "valfritt — hjälper oss att förbereda",

    "form.company": "Företagsnamn *",
    "form.name": "Ditt namn och roll *",
    "form.email": "E-post *",
    "form.phone": "Telefon <span class=\"optional\">(valfritt)</span>",
    "form.country": "Land / region *",
    "form.referral": "Hur hittade ni oss? <span class=\"optional\">(valfritt)</span>",
    "form.svcSoftware": "Mjukvaru- och apputveckling",
    "form.svcAnalytics": "Dataanalys och rapportering",
    "form.svcPipelines": "Dataflöden och integrationer",
    "form.svcMl": "AI / ML / statistisk modellering",
    "form.svcAnnotation": "Dataannotering för ML",
    "form.svcConsulting": "IT-rådgivning och strategi",
    "form.svcOutsourcing": "Outsourcad utveckling eller support",
    "form.svcUnsure": "Vet inte än — behöver rådgivning",
    "form.problem": "Beskriv problemet eller målet",
    "form.systems": "Nuvarande verktyg och system, om några",
    "form.timeline": "Önskad tidplan",
    "form.select": "Välj…",
    "form.asap": "Så snart som möjligt",
    "form.months13": "1–3 månader",
    "form.months36": "3–6 månader",
    "form.flexible": "Flexibelt",
    "form.budget": "Budgetspann",
    "form.budgetDiscuss": "Vill hellre diskutera",
    "form.budgetUnder": "Under 10 000 €",
    "form.budgetMid": "10 000 – 50 000 €",
    "form.budgetHigh": "50 000 €+",
    "form.consent": "Jag godkänner att Charged Development kontaktar mig angående den här förfrågan. Mina uppgifter hanteras i enlighet med gällande dataskyddslagstiftning.",
    "form.submit": "Skicka förfrågan",
    "form.note": "Går direkt till vår inkorg. Inget nyhetsbrev, ingen spam.",
    "form.sending": "Skickar…",
    "form.success": "Tack! Vi har fått er förfrågan och svarar via e-post inom 1–2 arbetsdagar.",
    "form.error": "Förfrågan kunde inte skickas. Mejla oss gärna direkt på contacts@chargeddata.com.",

    "quick.fab": "Kontakta oss",
    "quick.close": "Stäng kontaktmenyn",
    "quick.title": "Hur vill ni nå oss?",
    "quick.book": "Boka ett kostnadsfritt samtal",
    "quick.email": "Skicka ett mejl",
    "quick.call": "Ring +46 72 233 84 11",
    "quick.note": "Svar inom 1–2 arbetsdagar. Första samtalet är kostnadsfritt.",

    "footer.tagline": "Mjukvara, data och automation sedan 2019 · Stockholm, Sverige",
    "footer.place": "Stockholm, Sverige",
    "footer.privacy": "Integritetspolicy — kommer snart"
  };

  var DICTIONARIES = { sv: sv };

  /** English strings that only exist in JS, keyed the same way as the markup. */
  var EN_RUNTIME = {
    "work.showAll": "Show all {count} projects",
    "work.showFewer": "Show fewer projects",
    "form.sending": "Sending…",
    "form.success": "Thank you! We have your enquiry and will reply by email within 1–2 business days.",
    "form.error": "The enquiry could not be sent. Please email us directly at contacts@chargeddata.com.",
    "quick.fab": "Contact us",
    "quick.close": "Close the contact menu"
  };

  var currentLang = DEFAULT_LANG;
  var listeners = [];

  /** ?lang=sv makes a Swedish link shareable and wins over a previous choice. */
  function readUrlLang() {
    var match = /[?&]lang=([a-z]{2})/i.exec(window.location.search);
    if (!match) return null;
    var lang = match[1].toLowerCase();
    return SUPPORTED.indexOf(lang) > -1 ? lang : null;
  }

  function readStoredLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(stored) > -1 ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* Private browsing or blocked storage — the switch still works for this visit. */
    }
  }

  /** Remembers the English markup the first time an element is touched. */
  function englishFor(element, kind, attribute) {
    if (!element.__i18nEnglish) element.__i18nEnglish = {};
    var cache = element.__i18nEnglish;
    if (!(kind in cache)) {
      cache[kind] = kind === "html" ? element.innerHTML : element.getAttribute(attribute);
    }
    return cache[kind];
  }

  function applyTo(root, lang) {
    var dictionary = DICTIONARIES[lang];

    root.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.dataset.i18n;
      var english = englishFor(element, "html");
      var value = dictionary && dictionary[key];
      element.innerHTML = value !== undefined ? value : english;
    });

    ATTRIBUTE_BINDINGS.forEach(function (binding) {
      var selector = "[data-" + camelToDash(binding.dataKey) + "]";
      root.querySelectorAll(selector).forEach(function (element) {
        var key = element.dataset[binding.dataKey];
        var english = englishFor(element, binding.attribute, binding.attribute);
        var value = dictionary && dictionary[key];
        var next = value !== undefined ? value : english;
        if (next !== null && next !== undefined) element.setAttribute(binding.attribute, stripTags(next));
      });
    });
  }

  function camelToDash(value) {
    return value.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  }

  /** Attribute values must be plain text, so drop any inline markup from a translation. */
  function stripTags(value) {
    return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }

  var SITE_URL = "https://chargeddata.com/";
  var OG_LOCALES = { en: "en_GB", sv: "sv_SE" };

  /**
   * Keeps the crawler-facing signals in step with the visible language: the canonical URL,
   * og:url and og:locale, plus the address bar itself, so ?lang=sv is a real shareable and
   * indexable URL rather than a hidden client-side state.
   */
  function canonicalFor(lang) {
    return lang === DEFAULT_LANG ? SITE_URL : SITE_URL + "?lang=" + lang;
  }

  function setAttr(id, attribute, value) {
    var node = document.getElementById(id);
    if (node) node.setAttribute(attribute, value);
  }

  function syncSeo(lang) {
    var canonical = canonicalFor(lang);
    setAttr("canonical-link", "href", canonical);
    setAttr("og-url", "content", canonical);
    setAttr("og-locale", "content", OG_LOCALES[lang] || OG_LOCALES[DEFAULT_LANG]);
  }

  function syncUrl(lang) {
    if (!window.history || !window.history.replaceState) return;

    var params = new URLSearchParams(window.location.search);
    if (lang === DEFAULT_LANG) params.delete("lang");
    else params.set("lang", lang);

    var query = params.toString();
    var next = window.location.pathname + (query ? "?" + query : "") + window.location.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", next);
    }
  }

  function syncSwitchUi(lang) {
    document.querySelectorAll(".lang-btn").forEach(function (button) {
      var isActive = button.dataset.lang === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setLang(lang, options) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    currentLang = lang;

    document.documentElement.lang = lang;
    applyTo(document, lang);
    syncSwitchUi(lang);
    syncSeo(lang);
    syncUrl(lang);

    if (!options || options.persist !== false) storeLang(lang);

    listeners.forEach(function (listener) {
      listener(lang);
    });
  }

  function translate(key, replacements) {
    var dictionary = DICTIONARIES[currentLang];
    var value = (dictionary && dictionary[key]) || EN_RUNTIME[key] || key;

    if (replacements) {
      Object.keys(replacements).forEach(function (name) {
        value = value.split("{" + name + "}").join(replacements[name]);
      });
    }

    return value;
  }

  function initSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        setLang(button.dataset.lang);
      });
    });
  }

  window.I18N = {
    t: translate,
    setLang: setLang,
    get lang() {
      return currentLang;
    },
    onChange: function (listener) {
      listeners.push(listener);
    }
  };

  initSwitcher();

  var urlLang = readUrlLang();
  setLang(urlLang || readStoredLang() || DEFAULT_LANG, { persist: Boolean(urlLang) });
})();
