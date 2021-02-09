"use strict";

//@ts-check 
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen leimaamat rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin
// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

console.log(data);

console.dir(data);

console.log(JSON.parse(JSON.stringify(data)));                // Näyttää objektien oikean tilan

// Tulostaa datasta joukkueet nimen mukaisessa järjestyksessä
function tulostaJoukkueet(data) {

  let joukkueet = data.joukkueet.slice();
  joukkueet.sort(function (a, b) {
    var nimiA = a.nimi.toUpperCase().trim();                  // Sort -metodi, joka vertaa joukkueen a ja joukkueen b nimiä keskenään
    var nimiB = b.nimi.toUpperCase().trim();                  // Nimistä poistetaan vertailua varten ylimääräiset välilyönnit ja kirjaimet muutetaan isoiksi
    if (nimiA < nimiB) {                                      // Täten vertailussa ei ole väliä oliko nimi kirjoitettu isoilla vai pienillä kirjaimilla
      return -1;
    }
    if (nimiA > nimiB) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < joukkueet.length; i++) {
    log(joukkueet[i].nimi.trim() + " " + joukkueet[i].sarja.nimi.trim());   // Tulostetaan joukkueen nimi ja sarja
  }
  return;
}

var uusiJoukkue = {                                           //Luodaan uusi joukkue -objekti
  "nimi": "Mallijoukkue",
  "jasenet": [
    "Lammi Tohtonen",
    "Matti Meikäläinen"
  ],
  "leimaustapa": [0, 2],
  "rastit": [],
  "sarja": "",
  "id": 99999
};

// Lisää dataan parametrina annetun joukkueen haluttuun sarjaan
function lisaaJoukkue(data, joukkue, sarja) {

  if (data === undefined || joukkue === undefined || sarja === undefined) {   // Tarkistetaan että parametrit löytyy
    return;
  }

  uusiJoukkue = joukkue;
  for (let i = 0; i < data.sarjat.length; i++) {              // Käydään sarjat läpi ja kun löytyy parametria vastaava sarja,
    if (data.sarjat[i].nimi == sarja) {                       // niin lisätään parametrin joukkue kyseiseen sarjaan
      uusiJoukkue.sarja = data.sarjat[i];                     // ja asetetaan kyseinen sarja joukkueen sarjaksi
      break;
    }
    if (i == data.sarjat.length - 1) {                        // Jos sarjaa ei löydy niin ei tehdä mitään
      return;
    }
  }

  data.joukkueet.push(uusiJoukkue);                           // lisätään uusi joukkue dataan
  return;
}

// Vaihtaa datasta valitun sarjan nimen
function muutaSarjanNimi(data, vanhanimi, uusinimi) {

  for (let i = 0; i < data.sarjat.length; i++) {              // Käydään sarjat läpi ja kun löytyy vanhaanimeä vastaava sarjan nimi,
    if (data.sarjat[i].nimi == vanhanimi) {                   // niin vaihdetaan tilalle parametrina saatu uusi nimi
      data.sarjat[i].nimi = uusinimi;
      break;
    }
  }
  return;
}

// Tulostaa kaikki kokonaisluvulla alkavat rastien koodit järjestyksessä
function tulostaRastit(data) {
  let taulukko = [];
  for (let i = 0; i < data.rastit.length; i++) {              // Käydään läpi rastit ja tarkastetaan alkaako niiden koodit kokonaisluvulla
    if (isNaN(parseInt(data.rastit[i].koodi[0])) == false) {  // Kokonaisluvulla alkavat koodit lisätään taulukkoon, järjestetään aakkosjärjestykseen                                                                   
      taulukko.push(data.rastit[i].koodi);                    // ja tulostetaan niin, että jokaisen väliin lisätään ";" -merkki
    }
  }
  taulukko.sort();
  log("\n" + taulukko.join(";"));
  return;
}

lisaaJoukkue(data, uusiJoukkue, "8h");
muutaSarjanNimi(data, "8h", "10h");
tulostaJoukkueet(data);
tulostaRastit(data);


log("\n\n-------------" + "\n\n Taso 3" + "\n\n-------------");

// Poistaa datasta parametrina annetun joukkueen nimen perusteella
function poistaJoukkue(data, joukkue) {

  for (let i = 0; i < data.joukkueet.length; i++) {           // Käydään joukkueet läpi ja oikean nimisen joukkueen löytyessä
    if (data.joukkueet[i].nimi == joukkue) {                  // poistetaan se datasta
      data.joukkueet.splice(i, 1);
      break;
    }
  }
  return;
}
poistaJoukkue(data, "Vara 1");
poistaJoukkue(data, "Vara 2");
poistaJoukkue(data, "Vapaat");

// Vaihtaa annetun joukkueen rastin toiseen, sekä muuttaa rastin merkkausajan, mikäli uusi aika annettu
function vaihdaRasti(data, joukkue, rastinIdx, uusirasti, aika) {

  if (joukkue === undefined || rastinIdx < 0 || rastinIdx >= joukkue.rastit.length || uusirasti === undefined) {    // Tarkistetaan yleisimmät parametrien virheet
    console.log("Virheelliset parametrit vaihdaRastissa");                                                          // ja ilmoitetaan virheestä konsolissa kaatumisen sijaan
    return;
  }
  else {
    for (let i = 0; i < data.rastit.length; i++) {
      if (data.rastit[i].koodi == uusirasti) {
        joukkue.rastit[rastinIdx].rasti = data.rastit[i];
      }
    }
    if (aika !== undefined) {
      joukkue.rastit[rastinIdx].aika = aika;
    }
    return;
  }
}

function etsiJoukkueIndeksi(data, nimi) {
  for (let i = 0; i < data.joukkueet.length; i++) {
    if (data.joukkueet[i].nimi.trim().toUpperCase() == nimi.trim().toUpperCase()) {
      return data.joukkueet[i];
    }
  }
}

let haettuJoukkue = etsiJoukkueIndeksi(data, "Dynamic Duo");
// Tässä annetaan vaan suoraan Dynamic Duon indeksi eikä etsitä sitä millään tavalla
vaihdaRasti(data, haettuJoukkue, 73, 32);

// Laskee ja tulostaa jokaiselle joukkueelle pisteet datasta
function laskePisteet(data) {

  for (let i = 0; i < data.joukkueet.length; i++) {           // Käydään joukkueet läpi
    let joukkue = data.joukkueet[i];
    joukkue.pisteet = 0;                                      // Lisätään joukkueelle pisteet muuttuja
    let kaytetyt = [];
    let maalissa = false;
    let pisteetLaskuri = 0;

    for (let j = joukkue.rastit.length - 1; j >= 0; j--) {    // Käydään rastit läpi käänteisessä järjestyksessä

      let rasti = joukkue.rastit[j].rasti;
      if (rasti == "0" || rasti == undefined) {               // Olipas hauska temppu kun Dynamic Duon rasti [56] objektin "rasti" olikin "rast"
        continue;                                             // Skipataan "nolla" ja undefined rastit
      }
      if (rasti.koodi == "MAALI") {                           // Kun maali tulee vastaan, niin aloitetaan pisteiden lasku
        maalissa = true;
      }
      if (maalissa == true && rasti.koodi == "MAALI") {
        pisteetLaskuri = 0;                                   // Jos vastaan tulee toine "MAALI", niin aloitetaan pisteiden lasku alusta
      }
      if (rasti.koodi == "LAHTO" && maalissa == true) {       // Lopetetaan lasku, mikäli maali on jo tullut vastaan ja nyt löytyy lähtö
        break;
      }
      if (maalissa == true && (isNaN(parseInt(rasti.koodi[0])) == false) && kaytetyt.includes(rasti.koodi) == false) {  // Jos ollaan maalissa ja rastin eka kirjain on numero ja koodia ei ole
        pisteetLaskuri = pisteetLaskuri + parseInt(rasti.koodi[0]);                                                     // vielä käytetty, niin lisätään rastin pisteet pistelaskuriin
        kaytetyt.push(rasti.koodi);                                                                                     // ja merkataan koodi käytetyksi
      }
      if (j == 0 && rasti.koodi != "LAHTO") {                 // Jos päästään loppuun eikä missään vaiheessa tullut lähtöä vastaan, 
        pisteetLaskuri = 0;                                   // niin asetetaan pisteet nollille
      }
    }
    joukkue.pisteet = pisteetLaskuri;                         // Asetetaan laskurista pisteet joukkueelle
  }
  tulostaPisteet(data);
}

// Tulostaa joukkueiden nimet ja pisteet pisteiden mukaan laskevassa järjestyksessä
function tulostaPisteet(data) {
  let joukkuePisteet = data.joukkueet.slice();
  joukkuePisteet.sort(function (a, b) {
    if (b.pisteet > a.pisteet) {                              // Järjestetään joukkueet pisteiden mukaan laskevaan järjestykseen
      return 1;
    }
    else if (b.pisteet < a.pisteet) {
      return -1;
    }

    if (a.nimi > b.nimi) {                                    // Jos pisteet menee tasan niin järjestetään nimen mukaan
      return 1;
    }
    else if (a.nimi < b.nimi) {
      return -1;
    }
    else {
      return 0;                                               // Jos nimetki on samat nii ei maha mittää
    }
  });
  for (let i = 0; i < joukkuePisteet.length; i++) {
    log(joukkuePisteet[i].nimi.trim() + " (" + joukkuePisteet[i].pisteet + " p)");   // Tulostetaan joukkueen nimi ja pisteet
  }
  return;
}

laskePisteet(data);

log("\n\n-------------" + "\n\n Taso 5" + "\n\n-------------");

// Laskee ja tulostaa jokaiselle joukkueelle pisteet, ajan ja matkan datasta pisteiden mukaan laskevassa järjestyksessä
function laskePisteetAikaMatka(data) {

  for (let i = 0; i < data.joukkueet.length; i++) {           // Käydään joukkueet läpi
    let joukkue = data.joukkueet[i];
    let kaytetyt = [];
    let maalissa = false;
    let pisteetLaskuri = 0;
    let maaliAika = "";
    let maaliIndex = -1;
    let lahtoAika = "";
    let lahtoIndex = -1;
    joukkue.aika = "00:00:00";
    joukkue.matka = 0;
    joukkue.pisteet = 0;                                      // Lisätään joukkueelle pisteet muuttuja

    if (joukkue.rastit.length == 0) {
      continue;
    }

    for (let j = joukkue.rastit.length - 1; j >= 0; j--) {     // Käydään rastit läpi käänteisessä järjestyksessä

      let rasti = joukkue.rastit[j].rasti;
      if (rasti == "0" || rasti == undefined) {               // Skipataan "nolla" ja undefined rastit
        continue;
      }
      if (rasti.koodi == "MAALI") {                           // Kun maali tulee vastaan, niin aloitetaan pisteiden lasku
        maalissa = true;
        maaliAika = joukkue.rastit[j].aika;
        maaliIndex = j;
        continue;
      }
      if (maalissa == true && rasti.koodi == "MAALI") {
        pisteetLaskuri = 0;                                   // Jos vastaan tulee toine "MAALI", niin aloitetaan pisteiden lasku alusta
        maaliAika = joukkue.rastit[j].aika;
        maaliIndex = j;
        continue;
      }
      if (rasti.koodi == "LAHTO" && maalissa == true) {       // Lopetetaan lasku, mikäli maali on jo tullut vastaan ja nyt löytyy lähtö
        lahtoAika = joukkue.rastit[j].aika;
        lahtoIndex = j;
        break;
      }
      if (maalissa == true && (isNaN(parseInt(rasti.koodi[0])) == false) && kaytetyt.includes(rasti.koodi) == false) {  // Jos ollaan maalissa ja rastin eka kirjain on numero ja koodia ei ole
        pisteetLaskuri = pisteetLaskuri + parseInt(rasti.koodi[0]);                                                     // vielä käytetty, niin lisätään rastin pisteet pistelaskuriin
        kaytetyt.push(rasti.koodi);                                                                                     // ja merkataan koodi käytetyksi
        continue;
      }
      if (j == 0 && rasti.koodi != "LAHTO") {                 // Jos päästään loppuun eikä missään vaiheessa tullut lähtöä vastaan, 
        pisteetLaskuri = 0;                                   // niin asetetaan pisteet nollille
        break;
      }
    }
    joukkue.pisteet = pisteetLaskuri;                         // Asetetaan laskurista pisteet joukkueelle
    joukkue.aika = laskeAika(maaliAika, lahtoAika);
    joukkue.matka = laskeMatka(joukkue.rastit, maaliIndex, lahtoIndex);
  }
  tulostaPisteetAikaMatka(data);
}

// Laskee annettujen rastien välisen matkan lähdöstä maaliin 
function laskeMatka(rastit, maaliIndex, lahtoIndex) {
  let matka = 0;
  let matkaRastit = [];
  if (maaliIndex == -1 || lahtoIndex == -1) {                 // Jos ei ole päästy maaliin tai ei ole lähtöä niin palautetaan nolla
    return 0;
  }
  for (let i = lahtoIndex; i <= maaliIndex; i++) {            // Käydään rastit läpi lähdöstä maaliin ja laitetaan sopivat taulukkoon
    let rasti = rastit[i].rasti;
    if (rasti !== undefined && rasti.lat !== undefined && rasti.lon !== undefined) {  // Jos rastissa on vikaa niin ei oteta mukaan
      if (matkaRastit.length > 0) {
        if (matkaRastit[matkaRastit.length - 1] == rasti) {   // Poistaa duplikaatit, vaikkei niiden pitäisi vaikuttaa laskentaan
          continue;
        }
      }
      matkaRastit.push(rasti);
    }
  }
  for (let i = 0; i < matkaRastit.length - 1; i++) {          // Käydään uusi taulukko läpi ja lasketaan rastien etäisyydet yhteen
    matka = matka + getDistanceFromLatLonInKm(matkaRastit[i].lat, matkaRastit[i].lon, matkaRastit[i + 1].lat, matkaRastit[i + 1].lon);    // Lisätään matkaan uusi matka
  }
  return Math.round(matka);
}

// opettajan antama funktio, joka laskee koordinaattien välisen etäisyyden kilometreinä
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Laskee käytetyn ajan loppuajan ja alkuajan välillä
function laskeAika(maaliAika, lahtoAika) {
  let maaliDate = new Date(maaliAika);                        // Tehdään molemmista date -oliot
  let lahtoDate = new Date(lahtoAika);
  let aikaMs = maaliDate.getTime() - lahtoDate.getTime();     // Vähennetään datejen ajat toisistaan
  return new Date(aikaMs).toISOString().slice(11, -5);        // Tehdään millisekunneista uusi date, josta tehdään stringi ja otetaan siitä vain tunnit, minuutit ja sekunnit
}

// Tulostaa joukkueen nimen, pisteet, matkan ja ajan
function tulostaPisteetAikaMatka(data) {
  let joukkue = data.joukkueet.slice();
  joukkue.sort(function (a, b) {
    if (b.pisteet > a.pisteet) {                              // Järjestetään joukkueet pisteiden mukaan laskevaan järjestykseen
      return 1;
    }
    else if (b.pisteet < a.pisteet) {
      return -1;
    }

    if (a.aika > b.aika) {                                    // Jos pisteet menee tasan niin järjestetään ajan mukaan
      return 1;
    }
    else if (a.aika < b.aika) {
      return -1;
    }
    else {
      return 0;                                               // Jos ajatki on samat nii ei maha mittää
    }
  });
  for (let i = 0; i < joukkue.length; i++) {
    log(joukkue[i].nimi.trim() + ", " + joukkue[i].pisteet + " p, " + joukkue[i].matka + " km, " + joukkue[i].aika);   // Tulostetaan joukkueen nimi, pisteet, matka ja aika
  }
  return;
}

laskePisteetAikaMatka(data);