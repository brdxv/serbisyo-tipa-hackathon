# Morong, Rizal Real-Place Prototype Dataset

Research date: **2026-10-22**

This file defines the initial **real-world Morong, Rizal place cluster** to use for SerbisYO prototype maps, service lists, search results, profiles, comparison screens, and demo data.

## 1. Data Integrity Rule

The following fields in this file are intended to represent real places and should remain factual unless re-verified:

- place name
- category / institution type
- physical address
- latitude / longitude
- official/public operating information when explicitly sourced

SerbisYO-specific intelligence fields are **not real observed measurements unless we later collect them**. For the hackathon prototype, values such as the following may be simulated, but must be marked internally as prototype/demo data:

- average wait time
- processing time
- reliability percentage/label
- information accuracy score
- accessibility score
- community confidence
- busy hours
- recent experience text
- SerbisYO Score

Do not present synthetic prototype metrics as verified facts about the real establishments.

## 2. Recommended Map Zone

The selected places form one compact central-Morong cluster suitable for a single Explore map view.

```text
Suggested center: 14.512052, 121.238126
Latitude bounds: 14.505450 to 14.517550
Longitude bounds: 121.234840 to 121.241797
Approximate maximum point-to-point span: 1.35 km
```

The southern anchor is the Morong Municipal Hall/LTO/Public Market area. The northern anchor is the University of Rizal System - Morong / Rizal Provincial Hospital / Morong National High School area.

## 3. Canonical Initial Place List

| # | Place | Prototype category | Physical address | Coordinates | Recommended image |
|---|---|---|---|---|---|
| 1 | Morong Municipal Hall | Government Service | T. Claudio St., Sitio Paglabas, San Pedro, Morong, Rizal 1960 | `14.505450, 121.235710` | **Actual place photo preferred.** Use Municipality of Morong / Wikimedia Commons source. |
| 2 | LTO Morong District Office | Government / Transportation | LTO Complex, Morong, Rizal | `14.506290, 121.235340` | **Actual place photo preferred.** Use current branch/listing exterior; generate only if no clean usable exterior is available. |
| 3 | Morong Fire Station | Emergency / Government | Public Market Compound, San Pedro, Morong, Rizal | `14.506580, 121.236890` | **Actual place photo preferred.** Municipality of Morong has an official Fire Station page/photo. |
| 4 | Morong Public Market | Commerce / Public Facility | Brgy. San Pedro, Morong, Rizal | `14.507180, 121.237200` | **Actual place photo preferred.** Use recent market exterior/interior from LGU/news/public source. |
| 5 | Registry of Deeds - Morong | Government Service | G64Q+V44, Morong, Rizal; near Morong Public Market | `14.507200, 121.237770` | **Actual exterior preferred** from current business/map listing; generated government-office exterior only as fallback. |
| 6 | East Systems Colleges of Rizal | Education | J. Pascual St., San Pedro, Morong, Rizal 1960 | `14.509713, 121.241797` | **Actual campus/exterior preferred** from school/current listing. |
| 7 | Morong Rural Health Unit | Clinic / Healthcare | Brgy. San Pedro, Morong, Rizal. Latest PhilHealth list uses Tupas St.; other official health directories also reference Tomas Claudio St./Manila East Road. | `14.512813, 121.238828` | **Actual place photo preferred.** Municipality of Morong Municipal Health Office page is the preferred source. |
| 8 | Commandancia / Museong Pambayan ng Morong | Government / Museum / Public Facility | Tupas St., Morong, Rizal | `14.512889, 121.238911` | **Actual photo strongly preferred.** Wikimedia Commons and Municipality of Morong both have recognizable imagery. |
| 9 | Morong Doctors Hospital | Healthcare / Hospital | 491 Governor Martinez St., Morong, Rizal 1960 | `14.514340, 121.239400` | **Actual exterior preferred** from current hospital/business listing. |
| 10 | Savemore Market Morong | Commerce / Supermarket | Tomas Claudio St., Brgy. San Juan, Morong, Rizal 1960 | `14.514950, 121.239520` | **Actual branch photo preferred** so users recognize the real storefront. |
| 11 | Mercury Drug - Morong T. Claudio | Pharmacy | Tomas Claudio St., Morong, Rizal 1960 | `14.515100, 121.239050` | **Actual branch/storefront preferred** from current listing. |
| 12 | Rizal Provincial Hospital System - Morong | Government Hospital / Healthcare | Tomas Claudio St., Brgy. San Juan, Morong, Rizal 1960 | `14.516560, 121.239170` | **Actual photo strongly preferred.** A public-domain Wikimedia Commons exterior exists. |
| 13 | Supreme Care Medical Diagnostic & Imaging Center | Diagnostic Center / Healthcare | 743 Tomas Claudio St., Brgy. San Juan, Morong, Rizal 1960 | `14.516980, 121.239240` | **Actual clinic exterior preferred** from current clinic/listing/social source. |
| 14 | Morong National High School | Education | T. Claudio cor. Sumulong St., Brgy. San Juan, Morong, Rizal | `14.517190, 121.238230` | **Actual campus photo preferred** from DepEd/Wikimedia/current school listing. |
| 15 | University of Rizal System - Morong Campus | Education / University | Sumulong St., Brgy. San Juan, Morong, Rizal | `14.517550, 121.234840` | **Actual campus photo strongly preferred.** Use official URS or Wikimedia Commons imagery. |

## 4. Coordinate Provenance Notes

- Most coordinates above come from current OpenStreetMap-derived map listings or current public place listings.
- Morong Rural Health Unit coordinates use the center of the current full Plus Code `7Q63G67Q+4GG` shown by the business/map listing.
- East Systems Colleges of Rizal coordinates use the center of current full Plus Code `7Q63G65R+VPM`.
- Morong Rural Health Unit has a street-name discrepancy across official/public health directories. Until locally verified, use `Brgy. San Pedro, Morong, Rizal` as the stable display address and treat the street line as secondary metadata.
- Where an institution has conflicting older street descriptions across directories, prefer the most current official government/institution source for display text and keep the mapped coordinates stable unless a newer authoritative map source disproves them.

## 5. Recommended Image Policy for This Dataset

For real-place prototype cards and profiles:

1. Prefer a **real exterior photo of the actual place** when one is clearly available from an official website, official social page, Wikimedia Commons, or a reliable current place listing.
2. Prefer **Wikimedia Commons/public-domain or official-government images** when available because they are easier to reuse in a hackathon prototype and presentation.
3. If no clean, recent, recognizable real exterior is available, use a **generated representative image only as a fallback**, and do not imply that the generated building is the actual place.
4. Keep generated/synthetic photos visually realistic and consistent with Morong, Rizal architecture; do not invent official seals/signage that could be mistaken for a real photograph.
5. Store approved downloaded/generated place images locally rather than hotlinking third-party images in the final prototype.

## 6. Suggested Prototype Category Mapping

```text
Government
  - Morong Municipal Hall
  - Registry of Deeds - Morong
  - Commandancia / Museong Pambayan ng Morong

Transportation / Government
  - LTO Morong District Office

Emergency / Public Safety
  - Morong Fire Station

Healthcare
  - Morong Rural Health Unit
  - Morong Doctors Hospital
  - Rizal Provincial Hospital System - Morong
  - Supreme Care Medical Diagnostic & Imaging Center

Pharmacy
  - Mercury Drug - Morong T. Claudio

Education
  - East Systems Colleges of Rizal
  - Morong National High School
  - University of Rizal System - Morong Campus

Commerce / Public Facility
  - Morong Public Market
  - Savemore Market Morong
```

## 7. Source References

Primary/public sources used when establishing this dataset include:

- Municipality of Morong, Rizal: `https://morongrizal.gov.ph/`
- University of Rizal System: `https://www.urs.edu.ph/`
- Department of Health CALABARZON Rural Health Units directory: `https://ro4a.doh.gov.ph/rural-health-units/`
- PhilHealth accredited-facility lists: `https://www.philhealth.gov.ph/partners/providers/facilities/accredited/`
- Department of Education / DepEd CALABARZON public school and SHS lists
- OpenStreetMap-derived Mapcarta place records for coordinates
- Wikimedia Commons for reusable real-place imagery
- Current business/place listings for branch-specific addresses where official institutional pages do not publish coordinates

## 8. Development Use

Use `data/morong-real-places.json` as the structured machine-readable counterpart to this file.

When adding SerbisYO demo intelligence, keep the factual place identity/location fields unchanged and add synthetic fields separately with a marker such as:

```json
"prototypeMetrics": {
  "isSimulated": true
}
```
