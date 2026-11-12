---
title: "Our News"
layout: page/single.html
summary: "Our latest news"
omit_header_text: true
# featured_image: '/images/tud.jpg'
type: page
menu:
  main:
    weight: 2
---

## 3DBAG release 2025
*09.09.2025*

Today we are excited to release a new version of the 3DBAG. Major new features include two new output formats: `3D Tiles` (for web visualisation) and `IFC` (for BIM users). There are also some smaller improvements, such as the new attribute `b3_h_nok` containing the main ridgeline elevation. And we made several improvements to the docs, including some links to our 3dbag-scripts for developers.

The tooling behind the scenes also received many improvements, allowing us to release new 3DBAG versions faster and more reliably in the future. A notable example is the introduction of **a new global attribute schema**, allowing us to define and enforce a consistent set of attributes across all 3DBAG outputs. We also use this global schema to automatically generate the attribute schema documentation, which is now guaranteed to be accurate and up-to-date without requiring manual edits.

3DBAG is generated using 100% open source software. For this release we used our building reconstruction software **roofer version 1.0.0-beta-5**.

This release counts 107 715 47 BAG objects with a 3D building model and was funded by the **3DBAG innovation platform**.

Special thanks to **Amir Hakim** for his work on the IFC export functionality.

#### Changed / Fixed
- Attribute b3_kwaliteitsindicator was added to the CityJSON output
- Fixed attribute b3_kwaliteitsindicator being always false
- Removed attribute b3_succes
- Fixed extremely low and negative roof elevation values for some buildings
- Fixed in tile download map:
- Transparancy reduces after map move
- Map start point is now set to the center of the country.
- New attribute schema page in documentation

#### Added
- New output formats
- 3D tiles version 1.1
- IFC version 4.3
- new attributes:
    b3_h_nok
    b3_n_nok
- Structured attribute schema. This is used during the 3DBAG generation process and to generate documentation.
- List with the missing BAG objects was added to the metadata section on the download page.
- Documentation: added references to 3dbag-scripts, added new export formats (IFC, 3D tiles).

#### Known issues
- 397 512 BAG features without 3D model (typically due to a lack of elevation data) are missing from the output.
- b3_opp_dak_*, b3_opp_grond do not account for holes in the polygon.
- BAG date/time attributes in GPKG output are of the string type


---

##  Recording Available: 2nd 3DBAG Developers' Meeting
*18.06.2025*

On May 28th, 2025, we hosted the second 3DBAG Developers' Meeting. The event featured updates on the latest developments from the 3D geoinformation Group and 3DGI, as well as valuable insights from users from French National Institute of Geographical and Forest Information (IGNF) and the Geodetic Institute of Slovenia (GIS), who have applied 3DBAG to their own data and projects.

If you were unable to attend but would like to learn more about the project and its potential, the full recording is now available.


Event: 2nd 3DBAG Developers’ Meeting (Online)
Speakers:
Balázs Dukai (3DGI), Ravi Peters (3DGI), Gina Stavropoulou (3D geoinformation), Jantien Stoter (3D geoinformation), Hugo Ledoux (3D geoinformation), Emmanuel Séguin (IGNF), Nicolas Bellaiche (IGNF), Primož Kete (GIS).

[Watch the full recording here](https://youtu.be/M1ebdA58cg8)

---

## 3DBAG developers' meeting on May 28, 2025
*21.05.2025*

Do you want to learn more about 3DBAG?

Join us on 28 May 2025 for the second 3DBAG Developers Meeting – a free event for anyone using (or curious about) the 3DBAG software!

Whether you're already a user or just getting started, this is a great chance to:

- Discover the latest developments from [3D GeoInformation Group](https://3d.bk.tudelft.nl/) and [3DGI](https://3dgi.nl/)

- Learn how to generate building models in CityJSON through hands-on tutorials

- Hear from users who’ve applied 3DBAG to their own data and projects

The session is funded by the 3DBAG Innovation Platform and [Geonovum](https://www.geonovum.nl/).
If you're interested in 3D geodata, open-source tools, or want to contribute to the 3DBAG project yourself, we'd love to see you there!

The session will be held in English.

[Registration here](https://www.geonovum.nl/agenda/3dbag-developers-meeting-may-28-2025)

---

##  Recording Available: 3DBAG Developers' Meeting (13 Nov 2024)
*27.11.2024*

On November 13th, 2024, we held our first-ever 3DBAG Developers' Meeting — a great opportunity to connect, share updates, and dive deeper into how developers can work with 3DBAG.

If you couldn’t attend but are interested in learning more about the project and its possibilities, the full recording is now available.

Speakers:
Balázs Dukai, Ravi Peters, Gina Stavropoulou, Jantien Stoter, Hugo Ledoux, Ivan Pađen
Event: 3DBAG Developers’ Meeting (Online)
Date: 13 November 2024

[Watch the full recording here](https://www.youtube.com/watch?v=jctlRddCgiU)

We hope you find it insightful — and stay tuned for the next one!

---

## Activities 2024: launching the 3DBAG innovation platform
*26.11.2024*

The activities for launching the 3DBAG innovation platform in 2024 were the following:

- **Starting the 3DBAG user community** to visualize the use of 3DBAG and the wishes for further development. For this purpose, a 3DBAG user meeting was organized on Wednesday, October 2, 2024. During this meeting, users made presentations about their use cases, showcasing how they utilize 3DBAG and highlighting their needs and wishes for future development. The presentations provided valuable insights into practical applications and potential improvements. The presentations are available below.


- **Starting the 3DBAG Developers community**. The 3DBAG developers community consists of developers who either want to use the software (and not the already reconstructed 3D data), for example based on their own data sources, or want to enrich and expand the software with new features. To start this community, a kick-off was organized on Wednesday, November 13, 2024. Since the use and further development of the software is also relevant outside the Netherlands, the developers community will have an international character.

- **New release of 3DBAG based on AHN5**. AHN5 is now available for 2/3 of the Netherlands. Within the collaboration of the 3DBAG innovation platform, a study has been conducted on the impact of using AHN5 on the 3DBAG. Additionally, a new 3D BAG release will be issued based on AHN5.

#####  3DBAG User's Presentations

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