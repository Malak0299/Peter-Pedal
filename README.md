# Peter Pedal – Modul 9: REST og GraphQL

Peter Pedals cykelværksted har et lille API og en webside:

- **REST** til kunder og reservedele: `/api/customers`, `/api/spareparts`
- **GraphQL** til reparationssager: `/graphql`

Kunderne er et færdigt eksempel. Reservedele og en del af sagerne skal du selv lave — se `// TODO` i koden.

## Kom i gang

1. Start API'et: `dotnet run --project Peter-pedal-backend/src/PeterPedal.Api` → http://localhost:5080
2. Start frontenden: `dotnet run --project Peter-pedal-frontend/PeterPedal.Frontend` → http://localhost:5100
3. Åbn Swagger på http://localhost:5080/swagger og GraphQL på http://localhost:5080/graphql

## Del 1 – Udforsk det færdige eksempel (kunder)

- Prøv alle fem kunde-endpoints i Swagger med "Try it out". Notér metode, URL, body og statuskode for hver.
- Hvad sker der, hvis du opretter en kunde uden efternavn? Eller henter id 999?
- Læs `CustomersController` og `kunder.js`. Hvilken knap på siden kalder hvilket endpoint?

## Del 2 – REST: reservedele (backend)

- Implementér `GetById`, `Create`, `Update` og `Delete` i `SparePartsController` (se `// TODO`).
- Test hver metode i Swagger, før du går videre. Får du de rigtige statuskoder (200, 201, 204, 404)?

## Del 3 – REST: reservedele (frontend)

- Åbn siden Reservedele og prøv at oprette, rette og slette. Siden siger "oprettet", men der sker ikke noget. Hvorfor?
- Skriv de manglende kald i `reservedele.js` (se `// TODO`).
- Åbn browserens udviklerværktøjer (Network-fanen) og sammenlign requestet med det, du så i Swagger.

## Del 4 – GraphQL: sager

- Kør `repairCases`, `createCase` og `setStatus` på `/graphql`.
- Implementér `AddPart`, `CalculateOffer` og `DeleteCase` i `Mutation.cs`.
- Tjek: Egons sag med alle tre reservedele giver et tilbud på 1.908,75 kr.
