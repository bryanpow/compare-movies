import { initializeChart } from "./Chart";
const menu = document.getElementById("landp");
const movies = document.getElementById("moviePage");
const chart = document.getElementById("container");
const foot = document.getElementById("br");

export const handleHome = () => {
  document.getElementById("se").style.opacity = "0";
  document.getElementById("se").style.visibility = "hidden";
  const newUrl = window.location.origin + "/";
  window.history.pushState({}, "", newUrl);
  document.body.style.backgroundColor = "white";
  document.getElementById("dro").style.color = "black";
  whiteLog.style.filter = "none";
  document.getElementById("dro").style.color = "black";
  document.getElementById("logg").style.color = "black";
  const navParagraphs = document.querySelectorAll(" .change");
  navParagraphs.forEach((paragraph) => {
    paragraph.style.color = "black";
  });

  document.getElementById("dro").style.color = "black";
  movies.style.display = "none";
  chart.style.display = "none";
  menu.style.display = "none";
  menu.style.display = "flex";
  menu.style.visibility = "visible";
  document.getElementById("restoreDefault").style.visibility = "hidden";
  document.getElementById("clearDef").style.visibility = "hidden";
  document.getElementById("source").setAttribute("href", "/#br");
};




export const handleMovies = () => {
  const newUrl = window.location.origin + "/Movies";
  window.history.pushState({}, "", newUrl);
  document.body.style.backgroundColor = "white";
  whiteLog.style.filter = "none";
  document.getElementById("dro").style.color = "white";
  document.getElementById("logg").style.color = "black";
  const navParagraphs = document.querySelectorAll(" .change");
  navParagraphs.forEach((paragraph) => {
    paragraph.style.color = "black";
  });
  document.getElementById("dro").style.color = "black";
  document.getElementById("se").style.opacity = "1";
  document.getElementById("source").setAttribute("href", "/Movies#br");
  document.getElementById("restoreDefault").style.visibility = "visible";
  document.getElementById("clearDef").style.visibility = "visible";
  document.getElementById("se").style.visibility = "visible";
  menu.style.display = "none";
  chart.style.display = "none";
  movies.style.display = "flex";
  movies.style.visibility = "visible";
};
let whiteLog = document.getElementById("log2");



export const handleChart = () => {
  document.getElementById("se").style.display = "hidden";
  initializeChart();
  console.log("bruh");
  whiteLog.style.filter = "invert(100%)";
  const newUrl = window.location.origin + "/Chart";
  window.history.pushState({}, "", newUrl);
  window.addEventListener("resize", function () {
    location.reload();
  });
  document.getElementById("se").style.opacity = "0";

  document.body.style.backgroundColor = "#2d2d2d";
  document.getElementById("br").style.boxShadow = "none";
  document.getElementById("logo").style.color = "white";

  const navParagraphs = document.querySelectorAll(".change");
  navParagraphs.forEach((paragraph) => {
    paragraph.style.color = "white";
  });

  if (window.innerWidth < 699) {
    const navParagraphs2 = document.querySelectorAll("#aaa a");
    navParagraphs.forEach((paragraph) => {
      paragraph.style.color = "black";
    });
  }

  document.getElementById("dro").style.color = "white";
  const logoH2 = document.querySelector("#logo h2");
  logoH2.style.color = "white";

  document.getElementById("source").setAttribute("href", "/Chart#br");
  menu.style.display = "none";
  movies.style.display = "none";
  chart.style.display = "flex";
  chart.style.visibility = "visible";
};
