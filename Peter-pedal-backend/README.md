# Peter Pedals Cykelværksted — API

Et lille API til værkstedet:

- **REST** til kunder og reservedele: `/api/customers`, `/api/spareparts`
- **GraphQL** til reparationssager: `/graphql`

## Kom i gang

Du skal bruge en .NET SDK (8, 9 eller 10):

    cd src/PeterPedal.Api
    dotnet run

API'et kører på http://localhost:5080.

- Swagger UI (REST): http://localhost:5080/swagger
- Nitro (GraphQL): http://localhost:5080/graphql

## Eksempler på GraphQL

Hent alle sager med kunde og reservedele:

    query {
      repairCases {
        id
        frameNumber
        status
        price
        customer { firstName lastName }
        parts { name price }
      }
    }

Opret en sag:

    mutation {
      createCase(customerId: 1, frameNumber: "ABC-123", problem: "Punkteret dæk") { id status }
    }

Skift status på Egons sag (`CREATED`, `AWAITING_APPROVAL`, `APPROVED`, `FINISHED`, `PAID`):

    mutation {
      setStatus(caseId: 1, status: APPROVED) { id status }
    }

Bemærk: GraphQL svarer altid med HTTP 200, også ved fejl. Tjek `errors` i svaret. Et opslag, der ikke
findes, giver `null` (eller `false` for `deleteCase`).

## Database

Data gemmes i SQLite-filen `src/PeterPedal.Api/peterpedal.db`. Den oprettes automatisk ved første start ud
fra modellerne (`EnsureCreated`, ingen migrationer) med Egon, tre reservedele og Egons sag.

**Nulstil data:** stop API'et, slet `peterpedal.db`, og start igen. Det skal du også gøre, hvis du ændrer
modellerne.

## Struktur

| Mappe | Indhold |
|---|---|
| `Models/` | `Customer`, `SparePart`, `RepairCase`, `CaseStatus` og `PriceCalculator` |
| `Data/` | EF Core `DbContext` og seed-data |
| `Controllers/` | REST-controllere (`CustomersController`, `SparePartsController`) |
| `GraphQL/` | `Query` og `Mutation` — hver public metode bliver et felt i GraphQL |
| `Program.cs` | Opsætning: CORS, REST, GraphQL, Swagger |
