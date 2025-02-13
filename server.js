// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from "express";

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from "liquidjs";

// Je kunt de volgende URLs uit onze API gebruiken:
// - https://fdnd.directus.app/items/tribe
// - https://fdnd.directus.app/items/squad
// - https://fdnd.directus.app/items/person
// En combineren met verschillende query parameters als filter, sort, search, etc.
// Gebruik hiervoor de documentatie van https://directus.io/docs/guides/connect/query-parameters
// En de oefeningen uit https://github.com/fdnd-task/connect-your-tribe-squad-page/blob/main/docs/squad-page-ontwerpen.md

// Haal alle eerstejaars squads uit de WHOIS API op van dit jaar (2024–2025)
const squadResponse = await fetch(
  'https://fdnd.directus.app/items/squad?filter={"_and":[{"cohort":"2425"},{"tribe":{"name":"FDND Jaar 1"}}]}'
);

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
const squadResponseJSON = await squadResponse.json();

// Controleer de data in je console (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(squadResponseJSON)

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express();

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static("public"));

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine("liquid", engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set("views", "./views");

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

let filters = {
  name: null,
  fav_color: null,
  birthdate: null,
  avatar: null,
  emoji: null,
};
const baseUrl =
  "https://fdnd.directus.app/items/person/?fields=id,name,squads.squad_id.name,fav_color,fav_emoji,fav_country,birthdate,avatar,fav_kitchen&filter[squads][squad_id][name][_eq]=1G&filter[birthdate][_neq]=null&sort=birthdate";

// In theorie zou het super chill zijn om hier een functie van te maken maar tijd enzo
// const addToFilter = (updatedFilters) => {
//   let addedString = '';

//   updatedFilters.keys().forEach(filter => {
//     console.log(filter);

//     // if (filter == null) {
//     //   addedString = `{"${filter}":{"_neq":"null"}`
//     // }
//   })

// }

// Om Views weer te geven, heb je Routes nodig
// Maak een GET route voor de index
app.get("/", async function (request, response) {
  // Haal alle personen uit de WHOIS API op, van dit jaar
  // const personResponse = await fetch('https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={"_and":[{"squads":{"squad_id":{"tribe":{"name":"FDND Jaar 1"}}}},{"squads":{"squad_id":{"cohort":"2425"}}}]}')
  const personResponse = await fetch(baseUrl);

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json();

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "avatar",
    squads: squadResponseJSON.data,
  });
});

app.get("/emoji/", async function (request, response) {
  const filterString =
    "&filter[_and][0][fav_emoji][_neq]=null&filter[_and][1][squads][squad_id][name][_eq]=1G";

  // Haal alle personen uit de WHOIS API op, van dit jaar
  const personResponse = await fetch(baseUrl + filterString);

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json();

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "fav_emoji",
    squads: squadResponseJSON.data,
  });
});

app.get("/land/", async function (request, response) {
  const filterString =
    "&filter[_and][0][fav_country][_neq]=null&filter[_and][1][squads][squad_id][name][_eq]=1G";

  // Haal alle personen uit de WHOIS API op, van dit jaar
  const personResponse = await fetch(baseUrl + filterString);

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json();

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "fav_country",
    squads: squadResponseJSON.data,
  });
});

app.get("/verjaardag/", async function (request, response) {
  const baseUrl =
    "https://fdnd.directus.app/items/person/?fields=id,name,squads.squad_id.name,fav_color,fav_emoji,fav_country,birthdate,avatar";
  const filterString =
    "&filter[squads][squad_id][name][_eq]=1G&filter[birthdate][_neq]=null&sort=birthdate";

  // Voeg de filterstring correct toe aan de base URL
  const fullUrl = baseUrl + filterString;

  // Haal alle personen op via de API
  const personResponse = await fetch(fullUrl);

  // Converteer de response naar JSON
  const personResponseJSON = await personResponse.json();

  // Render de view met de opgehaalde data
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "birthdate",
    squads: squadResponseJSON.data,
  });
});


app.get("/eten/", async function (request, response) {
  const filterString =
    "&filter[_and][0][fav_kitchen][_neq]=null&filter[_and][1][squads][squad_id][name][_eq]=1G";

  // Haal alle personen uit de WHOIS API op, van dit jaar
  const personResponse = await fetch(baseUrl + filterString);

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json();

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "fav_kitchen",
    squads: squadResponseJSON.data,
  });
});



app.get("/kleur/", async function (request, response) {
  const filterString =
    "&filter[_and][0][fav_color][_neq]=null&filter[_and][1][squads][squad_id][name][_eq]=1G";

  // Haal alle personen uit de WHOIS API op, van dit jaar
  const personResponse = await fetch(baseUrl + filterString);

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json();

  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("index.liquid", {
    persons: personResponseJSON.data,
    show: "fav_color",
    squads: squadResponseJSON.data,
  });
});











// app.get('/emoji/:emoji', async function (request, response) {

//   const chosenEmoji = request.params.emoji ? '{"_eq":"'+ request.params.emoji + '"}' : '{"_neq":"null"}'
//   const filterString = '&filter={"_and":[{"fav_emoji":'+ chosenEmoji +'},{"squads":{"squad_id":{"name":{"_eq":"1G"}}}}]}'

//   // Haal alle personen uit de WHOIS API op, van dit jaar
//   const personResponse = await fetch(baseUrl + filterString)

//   // En haal daarvan de JSON op
//   const personResponseJSON = await personResponse.json()

//   // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
//   // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

//   // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
//   // Geef ook de eerder opgehaalde squad data mee aan de view
//   response.render('index.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
app.post("/", async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, "/");
});

// Maak een GET route voor een detailpagina met een route parameter, id
// Zie de documentatie van Express voor meer info: https://expressjs.com/en/guide/routing.html#route-parameters
app.get("/student/:id", async function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  const personDetailResponse = await fetch(
    "https://fdnd.directus.app/items/person/" + request.params.id
  );
  // En haal daarvan de JSON op
  const personDetailResponseJSON = await personDetailResponse.json();

  // Render student.liquid uit de views map en geef de opgehaalde data mee als variable, genaamd person
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render("student.liquid", {
    person: personDetailResponseJSON.data,
    squads: squadResponseJSON.data,
  });
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
