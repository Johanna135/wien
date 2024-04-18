/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// alles was mit L. anfangt ist eine Leafletsache
// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);
// die koordinaten sind in der Variable Stephansdom gespeichert, sie sind keine eigenen variablen --> let stephandsdom, deshlab muss ich auch darauf zugreifen

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
// das ist ein Plugin und wir können die Kartengrundlagen aus diesem Plugin verwenden.
// ich könnt zum Beispiel auch "BasemapAT.terrain", "BasemapAT.orthofoto" machen dass hab ich an hillshade, orthofoto ... einfach probieren aber haben wir dann in den layers unten
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  "sights": L.featureGroup().addTo(map),
}

// Hintergrundlayer
// das sind die layer auf der website auf der Karte, was man auswählen kann
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"), //hab ich dazu getan, man muss ein komma machen am Ende der Zeile
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
  })
  .addTo(map);

// Marker Stephansdom
L.marker([stephansdom.lat, stephansdom.lng])
  .addTo(themaLayer.sights)
  .bindPopup(stephansdom.title) //wir verwenden den Title von oben -- als Stephansdom
  .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

// Vollbild mit plugin Fullscreen
L.control
  .fullscreen()
  .addTo(map);

//syntax einer Funktion
// function addiere(zahl1, zahl2) {
//   let summe = zahl1 + zahl2;
//   console.log("Summe: ", summe)
// }
// addiere(4, 7);

async function loadSights(url) { // async weil wir brauchen das für await, für funktionen die länger dauern können
  console.log("Loading", url);
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson);
  L.geoJSON(geojson).addTo(themaLayer.sights);
  // wir laden die url down vom data.gv server und dann wandeln wir das in ein geojson um, so kann man sofort was visualisieren
}
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");