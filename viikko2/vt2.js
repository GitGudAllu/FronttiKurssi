"use strict";

//@ts-check 
// data-muuttuja on sama kuin viikkotehtävässä 1.
// Data-muuttuja oli sama kuin 2020 viikkotehtävässä 1, mutta eri kuin 2021 viikkotehtävässä 1

let jasenCounter = 1;

console.log(data);

window.onload = function () {
  luoJarjestysPainikkeet();
  asetaSarjaNimet();
  laskePisteet();
  listaaJoukkueet(0);
  luoRastiLomake();
  luoLisaysPohja();

};

// Luo rastienListauksen
function luoRastiListaus(joukkue) {
  haeRastiKoodit(joukkue);
  let form = document.getElementById("joukkue");
  let fieldset = form.getElementsByTagName("fieldset")[0];
  let rastitFieldset = document.createElement("fieldset");
  rastitFieldset.id = "rastitFieldset";
  fieldset.appendChild(rastitFieldset);
  let rastitLegend = document.createElement("legend");
  rastitLegend.textContent = "Muokkaa joukkueen rasteja";           // Luodaan tarvittavat elementit
  rastitFieldset.appendChild(rastitLegend);
  let select = document.createElement("select");
  let poistaButton = document.createElement("button");
  poistaButton.id = "poistaRastiButton";
  poistaButton.textContent = "Poista valittu rasti";
  poistaButton.name = "poistaRasti";
  poistaButton.joukkue = joukkue;
  select.id = ("rastitSelect");
  for (let i = 0; i < joukkue.rastit.length; i++) {                 // Täytetään select elementti rastien koodeilla
    let option = document.createElement("option");
    option.text = joukkue.rastit[i].koodi;
    select.add(option);
  }
  rastitFieldset.appendChild(select);
  rastitFieldset.appendChild(poistaButton);
}

// Poistaa valitun rastin valitulta joukkueelta selectin valitun indeksin perusteella
function poistaRasti(e) {
  let select = document.getElementById("rastitSelect");
  let joukkue = e.submitter.joukkue;
  let valittuRastiIndex = e.target.getElementsByTagName("select")[0].selectedIndex;
  joukkue.rastit.splice(valittuRastiIndex, 1);
  select.remove(select.selectedIndex);
  return;
}

// Hakee valitun joukkueen rastien koodit talteen
function haeRastiKoodit(joukkue) {
  let rastit = joukkue.rastit.slice();
  for (let i = 0; i < rastit.length; i++) {
    for (let j = 0; j < data.rastit.length; j++) {
      if (rastit[i].rasti == data.rastit[j].id + "") {
        rastit[i].koodi = data.rastit[j].koodi;
      }
    }
    if (rastit[i].koodi == undefined) {
      rastit[i].koodi = "0";
    }
  }
  joukkue.rastit = rastit;
  return joukkue;
}

// Tehdään listauksen järjestämiseen eventlistenerit
function luoJarjestysPainikkeet() {
  let pohja = document.getElementById("tupa");
  let otsikot = pohja.getElementsByTagName("th");
  for (let otsikko of otsikot) {
    otsikko.addEventListener("click", vaihdaJarjestys);
  }
}

// Ohjausfunktio, joka määrittelee parametrin halutun järjestyksen mukaan
// 0 = sarja,pisteet,nimi
// 1 = nimi
// 2 = pisteet
function vaihdaJarjestys(e) {
  if (e.target.textContent == "Sarja") {
    tyhjennaLista();
    listaaJoukkueet(0);
  }
  if (e.target.textContent == "Joukkue") {
    tyhjennaLista();
    listaaJoukkueet(1);
  }
  if (e.target.textContent == "Pisteet") {
    tyhjennaLista();
    listaaJoukkueet(2);
  }
}

// Lisää edelliseen suurimpaan Id:seen +1
function laskeid() {
  let idt = [];
  for (let i = 0; i < data.joukkueet.length; i++) {
    idt[i] = data.joukkueet[i].id;
  }
  let max = idt.reduce(function (a, b) {
    return Math.max(a, b);
  });
  max = max + 1;
  return max;
}

// Lisää jäsenille inputteja, pitää yllä jäsencountteria
function luoP() {
  let fieldsetJasen = document.getElementById("fieldsetJasenet");
  let p = document.createElement("p");
  let label = document.createElement("label");
  let labelTeksti = document.createTextNode("Jäsen " + jasenCounter + " ");
  label.appendChild(labelTeksti);
  let input = document.createElement("input");
  input.id = "jasenInput" + jasenCounter;
  if (jasenCounter <= 2) {
    input.required = true;
  }
  input.addEventListener("input", muokkaaP);
  label.appendChild(input);
  p.appendChild(label);
  fieldsetJasen.appendChild(p);
  jasenCounter++;
  return;
}

// Poistaa jäsenten inputteja, pitää yllä jäsencountteria
function poistaP() {
  let fieldsetJasen = document.getElementById("fieldsetJasenet");
  let pLista = fieldsetJasen.getElementsByTagName("p");
  if (pLista.length == 2) {
    return;
  }
  pLista[pLista.length - 1].remove();
  jasenCounter--;
  return;
}

// Päättää poistetaanko vai lisätäänkö inputteja
function muokkaaP(e) {
  if (e.currentTarget.value.length == 0) {
    poistaP();
  }
  else {
    if (e.currentTarget.value.length != 0 && e.currentTarget.id.slice(-1) == "" + (jasenCounter - 1)) {
      luoP();
    }
  }
  return;
}

// Luodaan elementit joukkueen lisäämiselle
function luoLisaysPohja() {
  let form = document.getElementById("joukkue");
  let fieldset = form.getElementsByTagName("fieldset")[0];
  let nimiInput = fieldset.getElementsByTagName("input")[0];
  piilotaMuutosButton();
  nimiInput.required = true;
  let fieldsetJasen = document.createElement("fieldset");
  fieldsetJasen.id = "fieldsetJasenet";
  fieldset.insertBefore(fieldsetJasen, fieldset.children[2]);
  luoP(fieldsetJasen);                                              // pakolliset 2 inputtia
  luoP(fieldsetJasen);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (e.submitter.name == "joukkue") {
      lisaaJoukkueDataan(e);
    }
    if (e.submitter.name == "muokkaa") {
      muutaJoukkueDataan(e);
    }
    if (e.submitter.name == "poistaRasti") {
      poistaRasti(e);
    }
  });
  return;
}

// Resetoi joukkuelomakkeen alkuperäiseen muotoon
function resetoiJoukkueLomake() {
  document.getElementById("joukkue").reset();
  let fieldsetJasen = document.getElementById("fieldsetJasenet");
  let pLista = fieldsetJasen.getElementsByTagName("p");
  while (pLista.length > 2) {
    poistaP();
  }
  return;
}

// Piilottaa lisäysbuttonin, kun on tarkoitus muokata joukkuetta
function piilotaLisaysButton() {
  let lisaysButton = document.getElementsByTagName("button")[1];
  let muutosButton = document.getElementsByTagName("button")[2];
  lisaysButton.disabled = true;
  lisaysButton.hidden = true;
  muutosButton.disabled = false;
  muutosButton.hidden = false;
}

// Pilottaa muutosbuttonin, kun on tarkoitus lisätä joukkue
function piilotaMuutosButton() {
  let muutosButton = document.getElementsByTagName("button")[2];
  let lisaysButton = document.getElementsByTagName("button")[1];
  muutosButton.disabled = true;
  muutosButton.hidden = true;
  lisaysButton.disabled = false;
  lisaysButton.hidden = false;
}

// Päivittää joukkueen muutetut tiedot dataan
function muutaJoukkueDataan(e) {
  let form = document.getElementById("joukkue");
  let fieldset = form.getElementsByTagName("fieldset")[0];
  let inputit = fieldset.getElementsByTagName("input");
  let joukkue = e.submitter.joukkue;
  let jasenet = [];
  joukkue.nimi = inputit[0].value;
  for (let i = 1; i < inputit.length - 1; i++) {
    jasenet.push(inputit[i].value);
  }
  joukkue.jasenet = jasenet;
  tyhjennaLista();
  laskePisteet();
  listaaJoukkueet(0);
  resetoiJoukkueLomake();
  poistaRastiListaus();
  piilotaMuutosButton();
}

// Lisää dataan uuden joukkueen
function lisaaJoukkueDataan(e) {
  let uusiJoukkue = {
    "nimi": "",
    "jasenet": [
    ],
    "leimaustapa": [0],
    "rastit": [],
    "sarja": 123456,
    "sarjanimi": "8h",
    "id": -1,
    "pisteet": 0,
  };
  uusiJoukkue.nimi = e.target[1].value;
  let fieldsetJasen = document.getElementById("fieldsetJasenet");
  let jasenet = fieldsetJasen.getElementsByTagName("input");        // Valitaan oikeassa fieldsetissä olevat inputit
  for (let jasen of jasenet) {                                      // ja käydään ne läpi
    if (jasen.value != "") {
      uusiJoukkue.jasenet.push(jasen.value);
    }
  }
  uusiJoukkue.id = laskeid();
  data.joukkueet.push(uusiJoukkue);
  tyhjennaLista();
  resetoiJoukkueLomake();
  listaaJoukkueet(0);
  return;
}

// Lisää dataan sarjojen nimet joukkueille
function asetaSarjaNimet() {
  for (let i = 0; i < data.joukkueet.length; i++) {
    for (let j = 0; j < data.sarjat.length; j++) {
      if (data.joukkueet[i].sarja == data.sarjat[j].id) {
        data.joukkueet[i].sarjanimi = data.sarjat[j].nimi;
      }
    }
  }
  return;
}

// Tulostaa rastit konsoliin
function tulostaRastit() {
  let rastit = data.rastit.slice();
  rastit.sort(function (a, b) {
    let koodiA = a.koodi.toUpperCase().trim();
    let koodiB = b.koodi.toUpperCase().trim();
    if (koodiA < koodiB) {
      return -1;
    }
    if (koodiA > koodiB) {
      return 1;
    }
    else {
      return 0;
    }
  });
  console.log("Rasti      " + "Lat        " + "Lon");
  for (let i = 0; i < rastit.length; i++) {
    console.log(rastit[i].koodi + "        " + rastit[i].lat + "      " + rastit[i].lon);
  }
  return;
}

//Järjestää joukkueet parametrin mukaan
// 0 = ensin sarja, sitten pisteet, sitten nimi
// 1 = nimi
// 2 = pisteet
function Jarjesta(jarjestys) {
  let listaJoukkueet = data.joukkueet.slice();
  listaJoukkueet.sort(function (a, b) {
    let sarjaA = a.sarjanimi.toUpperCase().trim();
    let sarjaB = b.sarjanimi.toUpperCase().trim();
    let nimiA = a.nimi.toUpperCase().trim();
    let nimiB = b.nimi.toUpperCase().trim();
    if (sarjaA < sarjaB && jarjestys == 0) {
      return -1;
    }
    else if (sarjaA > sarjaB && jarjestys == 0) {
      return 1;
    }
    else {
      if (a.pisteet < b.pisteet && (jarjestys == 0 || jarjestys == 2)) {
        return 1;
      }
      else if (a.pisteet > b.pisteet && (jarjestys == 0 || jarjestys == 2)) {
        return -1;
      }
      else {
        if (nimiA < nimiB && jarjestys == 0 || jarjestys == 1) {
          return -1;
        }
        else if (nimiA > nimiB && jarjestys == 0 || jarjestys == 1) {
          return 1;
        }
        else {
          return 0;
        }
      }
    }
  });
  return listaJoukkueet;
}

// Resetoi rastilomakkeen
function resetoiRastilomake() {
  document.getElementById("rastilomake").reset();
}

// Lisää uuden rastin dataan
function lisaaRasti() {
  let rasti = {
    lon: 0,
    koodi: "",
    lat: 0,
    id: 0,
  };
  let lat = parseFloat(document.getElementById("latInputRasti").value);
  let lon = parseFloat(document.getElementById("lonInputRasti").value);
  let koodi = document.getElementById("koodiInputRasti").value;
  if (isNaN(lat) === false && isNaN(lon) === false) {               // Lat ja Lon pitää olla float tyyppisiä
    if (koodi != "") {
      rasti.lat = lat.toString();
      rasti.lon = lon.toString();
      rasti.koodi = koodi;
      let idt = [];
      for (let i in data.rastit) {
        idt[i] = parseInt(data.rastit[i].id);
      }
      let max = idt.reduce(function (a, b) {
        return Math.max(a, b);
      });
      rasti.id = max + 1;
      data.rastit.push(rasti);
      tulostaRastit();
      resetoiRastilomake();
    } else {
      resetoiRastilomake();
      return;
    }
  } else {
    resetoiRastilomake();
    return;
  }
  return;
}

// Luo elementit rastien lisäämiseen
function luoRastiLomake() {
  let formRasti = document.getElementById("rastilomake");
  let fieldsetRasti = document.createElement("fieldset");
  fieldsetRasti.id = "fieldsetRasti";
  formRasti.appendChild(fieldsetRasti);
  let legendRasti = document.createElement("legend");
  let legendRastiTeksti = document.createTextNode("Rastin tiedot ");
  legendRasti.appendChild(legendRastiTeksti);
  fieldsetRasti.appendChild(legendRasti);
  for (let i = 0; i < Object.keys(data.rastit[0]).length - 1; i++) {      // Käydään läpi rasti-objektin ominaisuudet (id, lat, lon, koodi)
    let labelRasti = document.createElement("label");
    labelRasti.className = "labelRasti";
    let spanRasti = document.createElement("span");
    spanRasti.className = "spanRasti";
    let spanTeksti = document.createTextNode(Object.keys(data.rastit[0])[i] + " ");
    spanRasti.appendChild(spanTeksti);
    labelRasti.appendChild(spanRasti);
    let inputRasti = document.createElement("input");
    inputRasti.id = Object.keys(data.rastit[0])[i] + "InputRasti";
    inputRasti.type = "text";
    inputRasti.value = "";
    inputRasti.className = "inputRasti";
    labelRasti.appendChild(inputRasti);
    fieldsetRasti.appendChild(labelRasti);
  }
  let rastiButton = document.createElement("button");
  rastiButton.id = "rasti";
  let rastiButtonTeksti = document.createTextNode("Lisää rasti");
  rastiButton.appendChild(rastiButtonTeksti);
  fieldsetRasti.appendChild(rastiButton);
  formRasti.addEventListener("submit", function (event) {
    event.preventDefault();
    lisaaRasti();
  });
  return;
}

// Listaa joukkueen sarjan, nimen, jäsenet ja pisteet table-elementtiin
function listaaJoukkueet(jarjestys) {
  let lista = document.getElementById("tupa").getElementsByTagName("table");
  let joukkueet = Jarjesta(jarjestys);
  for (let i = 0; i < joukkueet.length; i++) {
    let rivi = document.createElement("tr");
    for (let j = 0; j < 3; j++) {                                   // Ekaan soluun sarja
      let soluteksti = "";
      let solujasenet = "";
      let solu = document.createElement("td");
      let soluline = document.createElement("br");
      if (j === 0) {
        soluteksti = document.createTextNode(joukkueet[i].sarjanimi);
        solu.appendChild(soluteksti);
      }
      if (j === 1) {                                                // Tokaan soluun nimi ja jäsenet
        soluteksti = document.createTextNode(joukkueet[i].nimi);
        solujasenet = document.createTextNode(joukkueet[i].jasenet.join(", "));
        let soluLinkki = document.createElement("a");
        soluLinkki.appendChild(soluteksti);
        soluLinkki.href = "#joukkue";
        soluLinkki.joukkue = joukkueet[i];
        soluLinkki.addEventListener("click", muokkaaJoukkue);
        solu.appendChild(soluLinkki);
        solu.appendChild(soluline);
        solu.appendChild(solujasenet);
      }
      if (j === 2) {                                                // Kolmanteen pisteet
        soluteksti = document.createTextNode(joukkueet[i].pisteet + " p");
        solu.appendChild(soluteksti);
      }
      rivi.appendChild(solu);
    }
    lista[0].appendChild(rivi);
  }
  return;
}

// Poistaa joukkueen rastilistauksen, mikäli semmoinen on olemassa
function poistaRastiListaus() {
  let pohja = document.getElementById("rastitFieldset");
  if (pohja == null) {
    return;
  }
  pohja.remove();
}

// Valmistelee elementit ja tuo joukkueen muokattavaksi
function muokkaaJoukkue(e) {
  let form = document.getElementById("joukkue");
  let fieldset = form.getElementsByTagName("fieldset")[0];
  let inputit = fieldset.getElementsByTagName("input");
  let muutosButton = form.getElementsByTagName("button")[1];
  let joukkue = e.target.joukkue;
  piilotaLisaysButton();
  poistaRastiListaus();
  luoRastiListaus(joukkue);
  muutosButton.joukkue = joukkue;
  inputit[0].value = joukkue.nimi;
  while (inputit.length <= joukkue.jasenet.length + 1) {
    luoP();
  }
  for (let i = 0; i < joukkue.jasenet.length; i++) {
    inputit[i + 1].value = joukkue.jasenet[i];
  }
  while (inputit.length > joukkue.jasenet.length + 2) {
    poistaP();
  }
  inputit[joukkue.jasenet.length + 1].value = "";
  return;
}

// Tyhjentaa table-elementin
function tyhjennaLista() {
  let lista = document.getElementById("tupa").getElementsByTagName("table")[0];
  for (let i = lista.rows.length - 1; i >= 1; i--) {
    lista.rows[i].remove();
  }
  return;
}

// Laskee jokaiselle joukkueelle pisteet datasta rastien perusteella
function laskePisteet() {

  let joukkuePisteet = [];
  let koodit = [];
  let rastiIdt = [];
  let laskuri = 0;
  for (let i = 0; i < data.joukkueet.length; i++) {                 // Käydään joukkueet yksitellen läpi muodostaen taulukko kerättyjen rastien id:eistä
    let joukkue = data.joukkueet[i];
    if (joukkue.rastit.length == 0 || joukkue.rastit.length == undefined || isNaN(joukkue.rastit.length)) {
      rastiIdt = [];
      koodit = [];
    } else {
      rastiIdt = [];
      koodit = [];
      laskuri = 0;
      for (let j = 0; j < joukkue.rastit.length; j++) {
        rastiIdt[j] = joukkue.rastit[j].rasti;                      // Joukkueen rastien id:t asetetaan taulukkoon
        for (let k = 0; k < data.rastit.length; k++) {
          if (parseInt(rastiIdt[j]) == data.rastit[k].id) {         // Verrataan kerättyjen rastien id:eitä rastien omiin id:eisiin, mitä kautta saadaan kerättyjen rastien koodit
            koodit[laskuri] = data.rastit[k].koodi;                 // Koodit asetetaan taulukkoon, jonka avulla lasketaan joukkueen pisteet
            laskuri++;
          }
        }
      }
    }
    let pisteet = 0;
    let maalissa = false;
    let kaytetyt = [];
    for (let l = koodit.length - 1; l >= 0; l--) {                  // "maalissa" -arvolla varmistetaan, ettei lasketa pisteitä väliltä, joka ei pääty maaliin    
      if (koodit[l] == "MAALI") {
        maalissa = true;
      }
      if (koodit[l] == "LAHTO" && maalissa == true) {               // Lopetetaan pisteiden laskenta ensimmäiseen "LAHTO" -koodiin, jonka jälkeen on päästy maaliin (lopusta päin)
        break;
      }
      if (l == 0 && koodit[l] != "LAHTO") {                         // Mikäli "LAHTO" -koodia ei tule koskaan vastaan, asetetaan pisteet nollille
        pisteet = 0;
        break;
      }
      if (isNaN(parseInt(koodit[l][0])) == false && maalissa == true && kaytetyt.includes(koodit[l]) == false) {
        pisteet = pisteet + parseInt(koodit[l][0]);                 // Tarkistetaan että ensimmäinen kirjain on kokonaisluku ja että on päästy maaliin ja ettei koodia ole jo laskettu
        kaytetyt.push(koodit[l]);

      }
    }
    joukkue.pisteet = pisteet;
  }
  joukkuePisteet.sort(function (a, b) {
    return b.joukkuepisteet - a.joukkuepisteet;                     // Järjestetään joukkueet pisteiden mukaan laskevaan järjestykseen
  });
  return;
}