---
title: "News"
layout: page/single.html
summary: "Ons laatste nieuws"
omit_header_text: true
# featured_image: '/images/tud.jpg'
type: page
menu:
  main:
    weight: 2
---

## 3D BAG release 2025 
*09.09.2025*

Vandaag zijn we verheugd om een nieuwe versie van de 3DBAG uit te brengen. Belangrijke nieuwe functies zijn twee nieuwe uitvoerformaten: `3D Tiles` (voor webvisualisatie) en `IFC` (voor BIM-gebruikers). Er zijn ook enkele kleinere verbeteringen, zoals het nieuwe attribuut `b3_h_nok` dat de hoofd-nokhoogte bevat. Daarnaast hebben we diverse verbeteringen doorgevoerd in de documentatie, waaronder verwijzingen naar onze 3dbag-scripts voor ontwikkelaars.

Ook de tooling achter de schermen is sterk verbeterd, waardoor we in de toekomst sneller en betrouwbaarder nieuwe 3DBAG-versies kunnen uitbrengen. Een opvallend voorbeeld is de introductie van **een nieuw globaal attributenschema**, waarmee we een consistente set attributen kunnen definiëren en afdwingen voor alle 3DBAG-uitvoer. Dit globale schema wordt ook gebruikt om automatisch de attributenschema-documentatie te genereren, die nu gegarandeerd accuraat en up-to-date is zonder handmatige aanpassingen.

3DBAG wordt gegenereerd met 100% open source software. Voor deze release is onze gebouwreconstructiesoftware **roofer versie 1.0.0-beta-5** gebruikt.

Deze release bevat 10.771.547 BAG-objecten met een 3D gebouwmodel en is gefinancierd door het **3DBAG innovatieplatform**.

Speciale dank aan **Amir Hakim** voor zijn werk aan de IFC-exportfunctionaliteit.

#### Aangepast / Opgelost
- Attribuut b3_kwaliteitsindicator toegevoegd aan de CityJSON-uitvoer
- Attribuut b3_kwaliteitsindicator is nu niet altijd false
- Attribuut b3_succes verwijderd
- Extreem lage en negatieve dakhoogtewaarden voor sommige gebouwen opgelost
- Opgelost in tegel-downloadkaart:
- Transparantie neemt af na het verplaatsen van de kaart
- Startpunt van de kaart is nu het midden van het land
- Nieuwe pagina voor attributenschema in de documentatie

#### Toegevoegd
- Nieuwe uitvoerformaten
- 3D tiles versie 1.1
- IFC versie 4.3
- nieuwe attributen:
    b3_h_nok
    b3_n_nok
- Gestructureerd attributenschema. Dit wordt gebruikt tijdens het 3DBAG-generatieproces en voor het genereren van documentatie.
- Lijst met ontbrekende BAG-objecten toegevoegd aan het metadata-gedeelte op de downloadpagina.
- Documentatie: verwijzingen naar 3dbag-scripts toegevoegd, nieuwe exportformaten (IFC, 3D tiles) toegevoegd.

#### Bekende problemen
- 397.512 BAG-objecten zonder 3D-model (meestal door gebrek aan hoogtegegevens) ontbreken in de uitvoer.
- b3_opp_dak_*, b3_opp_grond houden geen rekening met gaten in het polygoon.
- BAG datum/tijd-attributen in GPKG-uitvoer zijn van het type string

---

## Opname beschikbaar: 2nd 3DBAG Developers’ Meeting
*18.06.2025*

Op 28 mei 2025 organiseerden we de tweede 3DBAG Ontwikkelaarsbijeenkomst. Tijdens het evenement werden de nieuwste ontwikkelingen van de 3D Geoinformation Group en 3DGI gepresenteerd, evenals waardevolle inzichten gedeeld door gebruikers van het Franse National Institute of Geographical and Forest Information (IGNF) en het Geodetisch Instituut van Slovenië (GIS), die 3DBAG hebben toegepast op hun eigen data en projecten.

Kon je er niet bij zijn, maar wil je meer weten over het project en de mogelijkheden? De volledige opname is nu beschikbaar.

Evenement: 2nd 3DBAG Developers’ Meeting (Online)  
Sprekers: Balázs Dukai (3DGI), Ravi Peters (3DGI), Gina Stavropoulou (3D geoinformation), Jantien Stoter (3D geoinformation), Hugo Ledoux (3D geoinformation), Emmanuel Séguin (IGNF), Nicolas Bellaiche (IGNF), Primož Kete (GIS).

[Bekijk de volledige opname hier](https://youtu.be/M1ebdA58cg8)


---

## 3DBAG ontwikkelaarsbijeenkomst op 28 mei 2025
*21.05.2025*

Wil je meer weten over 3DBAG?

Doe mee op 28 mei 2025 aan de tweede 3DBAG Ontwikkelaarsbijeenkomst – een gratis evenement voor iedereen die de 3DBAG-software gebruikt (of nieuwsgierig is)!

Of je nu al gebruiker bent of net begint, dit is een mooie kans om:

- De nieuwste ontwikkelingen van de [3D GeoInformation Group](https://3d.bk.tudelft.nl/) en [3DGI](https://3dgi.nl/) te ontdekken
- Te leren hoe je gebouwmodellen in CityJSON genereert via praktische tutorials
- Te horen van gebruikers die 3DBAG hebben toegepast op hun eigen data en projecten

De sessie wordt gefinancierd door het 3DBAG Innovatieplatform en [Geonovum](https://www.geonovum.nl/).
Als je geïnteresseerd bent in 3D-geodata, open-source tools, of wilt bijdragen aan het 3DBAG-project, zien we je graag!

De sessie zal in het Engels worden gehouden.

[Aanmelden kan hier](https://www.geonovum.nl/agenda/3dbag-developers-meeting-may-28-2025)

---

##  Opname beschikbaar: 3DBAG Ontwikkelaarsbijeenkomst (13 nov 2024)
*27.11.2024*

Op 13 november 2024 vond onze allereerste 3DBAG Ontwikkelaarsbijeenkomst plaats — een mooie gelegenheid om te verbinden, updates te delen en dieper in te gaan op hoe ontwikkelaars met 3DBAG kunnen werken.

Kon je er niet bij zijn maar wil je meer weten over het project en de mogelijkheden? De volledige opname is nu beschikbaar.

Sprekers:
Balázs Dukai, Ravi Peters, Gina Stavropoulou, Jantien Stoter, Hugo Ledoux, Ivan Pađen  
Evenement: 3DBAG Ontwikkelaarsbijeenkomst (Online)  
Datum: 13 november 2024

[Bekijk de volledige opname hier](https://www.youtube.com/watch?v=jctlRddCgiU)

We hopen dat je het interessant vindt — en houd ons in de gaten voor de volgende bijeenkomst!

---

## Activiteiten 2024: opstarten 3DBAG innovatie platform
*26.11.2024*

De activiteiten voor het opstarten van het 3DBAG innovatieplatform zijn:
- **Starten 3DBAG gebruikers community** om gebruik van 3DBAG en de wensen voor doorontwikkeling in beeld te brengen. Hiervoor was op woensdag 2 oktober 2024 een 3DBAG gebruikers bijeenkomst georganiseerd. Tijdens deze bijeenkomst gaven gebruikers presentaties over hun use cases, waarin ze lieten zien hoe ze 3DBAG gebruiken en hun behoeften en wensen voor verdere ontwikkeling benadrukten. De presentaties boden waardevolle inzichten in praktische toepassingen en mogelijke verbeteringen. De presentaties zijn hieronder beschikbaar.

- **Starten 3DBAG Developers community**. De 3DBAG developers community bestaat uit ontwikkelaars die hetzij de software (en dus niet de reeds gereconstrueerde 3D data) willen gebruiken, bijvoorbeeld op basis van eigen data bronnen, hetzij de software willen verrijken en uitbreiden met nieuwe features. Om deze community op te starten is er op woensdag 13 november 2024 een kick-off georganiseerd. Omdat het gebruik en doorontwikkeling van de software ook relevant is voor buiten Nederland, zal de developers community een internationaal karakter hebben.

- **Nieuwe release 3DBAG op basis van AHN5**. AHN5 is beschikbaar voor 2/3 van Nederland. Binnen de samenwerking van het 3DBAG innovatieplatform is een studie gedaan naar de impact van het gebruik van AHN5 op de 3DBAG. Tevens zal er een nieuwe 3D BAG release worden uitgebracht op basis van AHN5.

#####  Presentaties van 3DBAG-gebruikers

- Bas-Jan Lubbers, TwinTopics, [TwinTopics bouwt het Platform TwinSPoT en gebruikt de 3DBAG om BIM modellen te positioneren voor haar Digital Twin van Gebouwen in haar omgeving](https://drive.google.com/file/d/1QY5nSh74CnMXi2EhAHAEyAA7GD3gOXQR/view?usp=drive_link)
- Christiaan Schreuder, ABN Amro, over klimaatrisico modellering afgemeld
- Wietse Baltser, Gemeente Amsterdam, Arjan Koelewijn, Gemeente Utrecht, [3D BAG in Netherlands 3D](https://drive.google.com/file/d/1_e5GmFLnuOUqDRjFn_2ny5TAHREeJS1b/view?usp=drive_link)
- Maarten Meijer, Henry de Lang, Hogeschool Utrecht, [Op weg naar LOD3.0 op basis van 3DBAG: 3D dak objecten met computer vision en Blender](https://drive.google.com/file/d/1MyJ1Rn48rCVotqndzk8IIUwG6719suYF/view?usp=drive_link)
- Edward Mac Gillavry, Webmapper, [een van de eerste visualisaties van 3D BAG en 3D Top10NL](https://drive.google.com/file/d/1fAZmXfXsAFpkbYEh6fVJ6Lg5ya-Gl0We/view?usp=drive_link)
- Jelmer Oosthoek, GIS Planet, [Analyse van de 3D BAG voor de Tomahawk tool van EnergyGo](https://drive.google.com/file/d/1ByIjJBacw4vhwdmEd0yDdMgiQnCPE9FD/view?usp=drive_link)
- Lucia Zwart, RVO, [gebruik van de 3D BAG bij het berekenen van warmteverliezen, potentieel zonne opwek, handhaving van subsidieaanvragen en vaststellen van renovaties](https://drive.google.com/file/d/139CJCqyD7axZWdznrgjAtXTd-A2mopBX/view?usp=drive_link)
- Gerlof de Haan, VNG, [3D BAG in 3DTilesNederland](https://drive.google.com/file/d/1CjCUgx54Sqb9xIwJGcYBYR3lK7nOCJkm/view?usp=drive_link)
- Jennifer Oldfield, RIVM, 3DBAG voor geluidsimulaties
- Jeroen Leusink, Het Waterschapshuis, [noklijnen database op basis van 3D BAG om 3D positie van gebouwen uniform vast te leggen](https://drive.google.com/file/d/1niZTD_7MkI2jvh1lM27CPTrzRRJZkFfj/view?usp=drive_link)
- Jeroen Bink, Actiflow, [3D BAG gebruik in windonderzoeken](https://drive.google.com/file/d/1jr4uKIQsz9xpJ2rycmJnJ5LUchj5-Ild/view?usp=drive_link)
- Aart van der Vlist SBLC B.V, platform Cuby, [gebouwd op 3DBAG](https://drive.google.com/file/d/1LbEpFyoVT6DiLBsxlZLMjqDDFqC_wSqL/view?usp=drive_link)
