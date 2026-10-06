# Peter Pedals Cykelværksted — Frontend

En simpel webside i HTML, CSS og JavaScript, der kalder API'et.

## Kom i gang

Start først API'et (se `Peter-pedal-backend/README.md`). Start derefter frontenden:

    cd PeterPedal.Frontend
    dotnet run

Åbn http://localhost:5100.

## Filer

| Fil | Indhold |
|---|---|
| `wwwroot/index.html` | Sender videre til `sager.html` |
| `wwwroot/kunder.html`, `reservedele.html`, `sager.html` | De tre sider |
| `wwwroot/js/config.js` | API'ets adresse |
| `wwwroot/js/rest.js` | `get`, `post`, `put`, `del` — kald til REST-API'et |
| `wwwroot/js/graphql.js` | `gql` — kald til GraphQL-API'et |
| `wwwroot/js/kunder.js`, `reservedele.js` | Kunder og reservedele (REST) |
| `wwwroot/js/sager.js` | Reparationssager (GraphQL) |
| `wwwroot/css/style.css` | Udseende |

Åbn browserens DevTools (fanen **Network**) for at se de requests og responses, siden sender.

Frontenden kører på en anden port end API'et. Derfor skal API'et tillade den via **CORS** (se `Program.cs` i API'et).
