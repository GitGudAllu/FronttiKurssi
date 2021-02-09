"use strict";
//@ts-check 

window.onload = function () {

  let body = document.getElementsByTagName("body")[0];
  let pollo = document.getElementById("pollo");
  luoPolloCanvaat(body, pollo);
  let canvaat = document.getElementsByClassName("pollot");
  let ctx1 = canvaat[0].getContext("2d");
  let ctx2 = canvaat[1].getContext("2d");
  let ctx3 = canvaat[2].getContext("2d");
  let ctx4 = canvaat[3].getContext("2d");
  ctx1.drawImage(pollo, 0, 0, pollo.width / 2, pollo.height / 2, 0, 0, pollo.width / 2, pollo.height / 2);
  ctx2.drawImage(pollo, pollo.width / 2, 0, pollo.width / 2, pollo.height / 2, 0, 0, pollo.width / 2, pollo.height / 2);
  ctx3.drawImage(pollo, 0, pollo.height / 2, pollo.width / 2, pollo.height / 2, 0, 0, pollo.width / 2, pollo.height / 2);
  ctx4.drawImage(pollo, pollo.width / 2, pollo.height / 2, pollo.width / 2, pollo.height / 2, 0, 0, pollo.width / 2, pollo.height / 2);

  lisaaPalkit(body, 10);
  setInterval(varjaa, 5000);
  setInterval(lisaaScrolleri, 1000);
};

function poistaScrolleri() {
  let scrolleri = document.getElementsByClassName("scroller")[0];
  scrolleri.remove();
}

function lisaaScrolleri() {
  let body = document.getElementsByTagName("body")[0];
  let teksti = window.kalevala();
  let canvas = document.createElement("canvas");
  canvas.className = "scroller";
  canvas.width = 600;
  canvas.height = 200;
  let ctx = canvas.getContext("2d");
  ctx.font = "4em Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(teksti, 300, 100);
  body.appendChild(canvas);
  setTimeout(poistaScrolleri, 5000);
}

function varjaa() {
  let colors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00", "#00ff00", "#00ffff", "#ffffff"];
  let stopit = document.getElementsByClassName("vari");
  for (let i = 0; i < stopit.length; i++) {
    stopit[i].style.stopColor = colors[(Math.floor(Math.random() * 8))];
  }
}

function luoPolloCanvaat(body, pollo) {
  for (let i = 0; i < 4; i++) {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas" + ("" + i);
    canvas.width = pollo.width / 2;
    canvas.height = pollo.height / 2;
    canvas.className = "pollot";
    body.appendChild(canvas);
  }
}

function lisaaPalkit(body, maara) {
  let palkki = document.getElementsByClassName("palkki")[0];
  palkki.style.animationDelay = (1 / 10) + "s";
  for (let i = 0; i < maara - 1; i++) {
    let uusipalkki = palkki.cloneNode(true);
    uusipalkki.style.animationDelay = (i / 10) + "s";
    uusipalkki.children[0].children[0].id = uusipalkki.children[0].children[0].id + ("" + i);
    body.appendChild(uusipalkki);
  }
}