"use strict";

// pidä tämä ensimmäisenä rivinä
//@ts-check 

console.log(data);

window.onload = function () {
  listaajoukkueet();
  alustaForm();
  haeLeimaustavatFormiin();
  haeSarjatFormiin();
  piilotaMuokkaaNappi();
};

function listaajoukkueet() {
  let joukkueet = data.joukkueet.slice();
  joukkueet = jarjestaNimi(joukkueet);
  let lista = document.getElementById("joukkuelista");
  for (let i = lista.childElementCount - 1; i >= 0; i--) {
    lista.removeChild(lista.children[i]);                           // Tyhjennetään aluksi lista
  }
  for (let i = 0; i < joukkueet.length; i++) {                   // Luodaan uudet tarvittavat elementit
    joukkueet[i].jasenet = jarjestaNimi(joukkueet[i].jasenet);
    let sarjanimi = haeSarja(joukkueet[i].sarja);
    let joukkuenimi = document.createElement("li");
    let joukkuesarja = document.createElement("strong");
    let jasenetlista = document.createElement("ul");
    let joukkuelinkki = document.createElement("a");
    joukkuelinkki.textContent = joukkueet[i].nimi.trim() + " ";    // Asetetaan elementteihin tarvittavat arvot
    joukkuelinkki.joukkue = joukkueet[i];
    joukkuelinkki.href = "#formMain";
    joukkuelinkki.addEventListener("click", haeJoukkue);          // Asetetaan linkille eventlistener, jolla saadaan muokkaus -näkymä aikaiseksi
    joukkuesarja.textContent = sarjanimi;
    joukkuelinkki.appendChild(joukkuesarja);                        // Lisätään elementit oikeille paikoille
    joukkuenimi.appendChild(joukkuelinkki);
    for (let j = 0; j < joukkueet[i].jasenet.length; j++) {    // luodaan ja lisätään jäsenet jäsenlistaukseen
      let jasen = document.createElement("li");
      jasen.textContent = joukkueet[i].jasenet[j];
      jasenetlista.appendChild(jasen);
    }
    joukkuenimi.appendChild(jasenetlista);                          // Lisätään jäsenlistaukset joukkuelistaukseen
    lista.appendChild(joukkuenimi);                                 // Lisätään joukkuelistaukset päälistaan
  }
  return;
}

function haeJoukkue(e) {
  let formi = document.getElementById("formMain");
  formi.reset();
  let jasenInputit = document.getElementsByName("jasen");
  while (jasenInputit.length > 2) {
    jasenInputit[jasenInputit.length - 2].dispatchEvent(new Event("input"));
  }
  let nimiInput = document.getElementById("nimiinput");
  let joukkue = e.currentTarget.joukkue;
  nimiInput.value = joukkue.nimi;
  nimiInput.joukkue = joukkue;
  let leimausInputit = document.getElementsByName("leimaustapaCheckbox");
  for (let i = 0; i < joukkue.leimaustapa.length; i++) {
    for (let j = 0; j < leimausInputit.length; j++) {
      if (joukkue.leimaustapa[i] == leimausInputit[j].value) {
        leimausInputit[j].checked = true;
      }
    }
  }
  let sarjaInputit = document.getElementsByName("sarjatRadio");
  for (let i = 0; i < sarjaInputit.length; i++) {
    if (joukkue.sarja == parseInt(sarjaInputit[i].value)) {
      sarjaInputit[i].checked = true;
    }
  }
  for (let i = 0; i < joukkue.jasenet.length; i++) {
    let jasenInputit = document.getElementsByName("jasen");
    jasenInputit[i].value = joukkue.jasenet[i];
    jasenInputit[i].dispatchEvent(new Event("input"));
  }
  piilotaLisaaNappi();
  return;
}

function haeSarja(sarjaid) {
  for (let i = 0; i < data.sarjat.length; i++) {                      // Käy läpi kaikki sarjat ja palauttaa sen sarjan nimen, jonka id mathcaa parametriin
    if (data.sarjat[i].id == sarjaid) {
      return data.sarjat[i].nimi;
    }
  }
  return "";                                                          // Palauttaa tyhjän sarjan nimen, jos jotain menee pieleen
}

function resetoiFormit() {
  let forms = document.getElementsByTagName("form");
  let jasenInputit = document.getElementsByName("jasen");
  for (let i = 0; i < forms.length; i++) {
    forms[i].reset();
  }
  while (jasenInputit.length > 2) {
    jasenInputit[jasenInputit.length - 1].parentNode.parentNode.remove();
  }
  let sarjaInputit = document.getElementsByName("sarjatRadio");
  if (sarjaInputit.length > 0) {
    sarjaInputit[0].checked = true;
  }
  return;
}

function alustaForm() {
  let form = document.getElementById("formMain");
  let form2 = document.getElementById("leimausformi");
  resetoiFormit();
  let nimiInput = document.getElementById("nimiinput");
  nimiInput.addEventListener("input", tarkistaJoukkueNimi);
  let jasenInputit = document.getElementsByName("jasen");
  jasenInputit[0].addEventListener("input", (e) => {
    tarkistaJasenetMaara(e);
    tarkistaJasenet(e);
  });
  jasenInputit[1].addEventListener("input", (e) => {
    tarkistaJasenetMaara(e);
    tarkistaJasenet(e);
  });
  form.addEventListener("submit", function (e) {                 // Kun submitataan joukkeform niin katsotaan ollaanko lisäämässä vai muokkaamassa
    e.preventDefault();
    if (e.submitter.id == "lisaajoukkuebutton") {                   // Jos submit tuli tallennabuttonilta niin lisätään
      if (tarkistaPaaForm(1)) {
        tallennaLisays();
      }
    }
    if (e.submitter.id == "muokkaajoukkuebutton") {                    // Jos submit tuli muokkaabuttonilta niin muokataan
      if (tarkistaPaaForm(0)) {
        tallennaMuokkaus();
      }
    }
  });
  jasenInputit[1].dispatchEvent(new Event("input"));
  let leimausInput = document.getElementById("leimausinput");
  leimausInput.addEventListener("input", tarkistaLeimaus);
  form2.addEventListener("submit", function (e) {
    e.preventDefault();
    if (tarkistaLeimaus()) {
      lisaaLeimaus();
    }
  });
  return;
}

function lisaaLeimaus() {
  let leimausInput = document.getElementById("leimausinput");
  data.leimaustavat.push(leimausInput.value);
  haeLeimaustavatFormiin();
  resetoiFormit();
  return;
}

function tarkistaLeimaus() {
  let leimaustavat = data.leimaustavat.slice();
  let leimausInput = document.getElementById("leimausinput");
  leimausInput.setCustomValidity("");
  leimausInput.reportValidity();
  for (let i = 0; i < leimaustavat.length; i++) {
    if (leimausInput.value.trim().toUpperCase() == leimaustavat[i].trim().toUpperCase()) {
      leimausInput.setCustomValidity("Leimaustapa on jo olemassa");
      leimausInput.reportValidity();
      return false;
    }
  }
  return true;
}

function tallennaMuokkaus() {
  let nimiInput = document.getElementById("nimiinput");
  let leimausInputit = document.getElementsByName("leimaustapaCheckbox");
  let sarjaInputit = document.getElementsByName("sarjatRadio");
  let jasenInputit = document.getElementsByName("jasen");
  let joukkue = nimiInput.joukkue;
  joukkue.nimi = nimiInput.value;
  joukkue.leimaustapa = [];
  for (let i = 0; i < leimausInputit.length; i++) {
    if (leimausInputit[i].checked == true) {
      joukkue.leimaustapa.push(leimausInputit[i].value);
    }
  }
  for (let i = 0; i < sarjaInputit.length; i++) {
    if (sarjaInputit[i].checked == true) {
      joukkue.sarja = parseInt(sarjaInputit[i].value);
    }
  }
  joukkue.jasenet = [];
  for (let i = 0; i < jasenInputit.length; i++) {
    if (jasenInputit[i].value == "") {
      continue;
    }
    joukkue.jasenet.push(jasenInputit[i].value);
  }
  for (let i = 0; i < data.joukkueet.length; i++) {
    if (data.joukkueet[i].id == joukkue.id) {
      data.joukkueet[i] = joukkue;
    }
  }
  piilotaMuokkaaNappi();
  resetoiFormit();
  listaajoukkueet();
  return;
}

function tarkistaJasenetMaara(e) {
  let jasenInputit = document.getElementsByName("jasen");
  let taysia = 0;
  for (let i = 0; i < jasenInputit.length; i++) {
    if (jasenInputit[i].value != "") {
      taysia++;
    }
  }
  if (taysia == jasenInputit.length) {
    let mainDiv = document.getElementById("divjasenet");
    let uusiDiv = document.createElement("div");
    let uusiLabel = document.createElement("label");
    let labelteksti = document.createTextNode("Jäsen " + (jasenInputit.length + 1) + " ");
    uusiLabel.appendChild(labelteksti);
    let uusiInput = document.createElement("input");
    if (jasenInputit.length < 2) {
      uusiInput.required = true;
    }
    uusiInput.name = "jasen";
    uusiInput.addEventListener("input", (e) => {
      tarkistaJasenetMaara(e);
      tarkistaJasenet(e);
    });
    uusiLabel.appendChild(uusiInput);
    uusiDiv.appendChild(uusiLabel);
    mainDiv.appendChild(uusiDiv);
    return;
  }
  if (taysia < jasenInputit.length && jasenInputit.length > 2 && e.target.value == "") {
    for (let i = jasenInputit.length - 1; i > 0; i--) {
      if (jasenInputit[i].value == "") {
        e.target.value = jasenInputit[jasenInputit.length - 2].value;
        jasenInputit[jasenInputit.length - 2].value = "";
        jasenInputit[jasenInputit.length - 1].parentNode.parentNode.remove();
        return;
      }
    }
  }
}

function haeLeimaustavatFormiin() {
  let leimausTavatDiv = document.getElementById("leimaukset");
  while (leimausTavatDiv.childElementCount > 0) {
    leimausTavatDiv.removeChild(leimausTavatDiv.firstElementChild);
  }
  let leimausTavat = data.leimaustavat.slice();
  let LeimausTavatIndex = [];
  for (let i = 0; i < leimausTavat.length; i++) {
    let leimaustapa = {
      nimi: leimausTavat[i],
      index: i
    };
    LeimausTavatIndex.push(leimaustapa);
  }
  LeimausTavatIndex = jarjestaNimi(LeimausTavatIndex);
  for (let i = 0; i < leimausTavat.length; i++) {
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    label.textContent = LeimausTavatIndex[i].nimi;
    input.id = "checkbox" + LeimausTavatIndex[i].nimi;
    input.type = "checkbox";
    input.name = "leimaustapaCheckbox";
    input.value = LeimausTavatIndex[i].index;
    input.addEventListener("input", tarkistaCheckboxit);
    label.appendChild(input);
    div.appendChild(label);
    leimausTavatDiv.appendChild(div);
  }
}

function haeSarjatFormiin() {
  let sarjatDiv = document.getElementById("sarjat");
  let sarjat = data.sarjat.slice();
  sarjat = jarjestaNimi(sarjat);
  for (let i = 0; i < sarjat.length; i++) {
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    label.textContent = sarjat[i].nimi;
    input.id = "radio" + sarjat[i].nimi;
    input.type = "radio";
    input.name = "sarjatRadio";
    input.value = sarjat[i].id;
    if (i == 0) {
      input.checked = "checked";
    }
    label.appendChild(input);
    div.appendChild(label);
    sarjatDiv.appendChild(div);
  }
}

function jarjestaNimi(lista) {
  lista.sort(function (a, b) {
    let A = "";
    let B = "";
    if (a.nimi == undefined) {
      A = a.toUpperCase().trim();
      B = b.toUpperCase().trim();
    }
    else {
      A = a.nimi.toUpperCase().trim();
      B = b.nimi.toUpperCase().trim();
    }
    if (A < B) {
      return -1;
    }
    if (A > B) {
      return 1;
    }
    else {
      return 0;
    }
  });
  return lista;
}

function piilotaMuokkaaNappi() {
  let muokkaanappi = document.getElementById("muokkaajoukkuebutton");
  let lisaanappi = document.getElementById("lisaajoukkuebutton");
  lisaanappi.disabled = false;
  lisaanappi.hidden = false;
  muokkaanappi.disabled = true;
  muokkaanappi.hidden = true;
}

function piilotaLisaaNappi() {
  let muokkaanappi = document.getElementById("muokkaajoukkuebutton");
  let lisaanappi = document.getElementById("lisaajoukkuebutton");
  lisaanappi.disabled = true;
  lisaanappi.hidden = true;
  muokkaanappi.disabled = false;
  muokkaanappi.hidden = false;
}

function tarkistaPaaForm(nimi) {
  if (nimi == 1) {
    if (tarkistaJoukkueNimi() == false) {
      return false;
    }
  }
  if (tarkistaCheckboxit() == false) {
    return false;
  }
  if (tarkistaJasenet() == false) {
    return false;
  }
  else {
    return true;
  }
}

function tarkistaJoukkueNimi() {
  let joukkueet = data.joukkueet.slice();
  let joukkueNimi = document.getElementById("nimiinput");
  joukkueNimi.setCustomValidity("");
  joukkueNimi.reportValidity();
  for (let i = 0; i < joukkueet.length; i++) {
    if (joukkueNimi.value.trim().toUpperCase() == joukkueet[i].nimi.trim().toUpperCase()) {
      joukkueNimi.setCustomValidity("Nimi on jo käytössä");
      joukkueNimi.reportValidity();
      return false;
    }
  }
  return true;
}

function tarkistaCheckboxit() {
  let checkBoxit = document.getElementsByName("leimaustapaCheckbox");
  checkBoxit[checkBoxit.length - 1].setCustomValidity("");
  checkBoxit[checkBoxit.length - 1].reportValidity();
  for (let i = 0; i < checkBoxit.length; i++) {
    if (checkBoxit[i].checked == true) {
      return true;
    }
    else if (i == (checkBoxit.length - 1) && checkBoxit[i].checked == false) {
      checkBoxit[i].setCustomValidity("Valitse ainakin yksi");
      checkBoxit[i].reportValidity();
      return false;
    }
  }
}

function tarkistaJasenet() {
  let jasenInputit = document.getElementsByName("jasen");
  for (let i = 0; i < jasenInputit.length; i++) {
    for (let j = i + 1; j < jasenInputit.length; j++) {
      jasenInputit[0].setCustomValidity("");
      jasenInputit[0].reportValidity();
      if (jasenInputit[i].value != "" && jasenInputit[i].value == jasenInputit[j].value) {
        jasenInputit[0].setCustomValidity("Jäsenten nimet eivät ole uniikkeja");
        jasenInputit[0].reportValidity();
        return false;
      }
    }
  }
  return true;
}

function tallennaLisays() {
  let uusijoukkue = {
    nimi: "",
    id: -1,
    sarja: -1,
    jasenet: [],
    rastit: [],
    leimaustapa: [0]
  };
  let joukkueNimi = document.getElementById("nimiinput").value;
  let jasenetInputit = document.getElementsByName("jasen");
  let jasenet = [];
  for (let i = 0; i < jasenetInputit.length; i++) {
    if (jasenetInputit[i].value == "") {
      continue;
    }
    jasenet.push(jasenetInputit[i].value);
  }
  let joukkueId = laskeid();
  let sarjat = document.getElementsByName("sarjatRadio");
  let valittuSarja = -1;
  let leimaustavat = document.getElementsByName("leimaustapaCheckbox");
  let valitutLeimaustavat = [];
  for (let i = 0; i < sarjat.length; i++) {
    if (sarjat[i].checked == true) {
      valittuSarja = parseInt(sarjat[i].value);
    }
  }
  for (let i = 0; i < leimaustavat.length; i++) {
    if (leimaustavat[i].checked == true) {
      valitutLeimaustavat.push(parseInt(leimaustavat[i].value));
    }
  }
  uusijoukkue.nimi = joukkueNimi;
  uusijoukkue.id = joukkueId;
  uusijoukkue.sarja = valittuSarja;
  uusijoukkue.leimaustapa = valitutLeimaustavat;
  uusijoukkue.jasenet = jasenet;
  console.log(uusijoukkue);
  data.joukkueet.push(uusijoukkue);
  listaajoukkueet();
  resetoiFormit();
}

function laskeid() {
  let idt = [];
  for (let i = 0; i < data.joukkueet.length; i++) {           // Käydään hakemassa joukkueiden id:t taulukkoon
    idt[i] = data.joukkueet[i].id;
  }
  let max = idt.reduce(function (a, b) {                      // Etsitään taulukosta suurin
    return Math.max(a, b);
  });
  max = max + 1;                                              // Lisätään suurimpaan 1
  return max;
}