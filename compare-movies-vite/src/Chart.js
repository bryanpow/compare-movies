import { getCard, getDefault } from "./localStorage";

import Chart from "chart.js/auto";
//CHARTS
let active = false;
export const initializeChart = () => {
  const chart1 = document.getElementById("bar").getContext("2d");
  const chart2 = document.getElementById("pie").getContext("2d");
  const defaultData = () => getDefault();
  const addedData = () => getCard();
  const getBox = (target) => target.map((movie) => movie.box);
  const defaultBox = () => getBox(defaultData);
  let allDomestic = null;
  if (!addedData)
    allDomestic = () => defaultData.map((movie) => [movie.title, movie.box]);
  else
    allDomestic = () =>
      defaultData()
        .concat(addedData())
        .map((movie) => [movie.title, movie.box]);

  console.log(allDomestic());
  let domesticSorted = () => allDomestic().sort((a, b) => b[1] - a[1]);
  const allData = () => defaultData().concat(addedData() || []);
  console.log(domesticSorted());
  let background = () =>
    Array.from({ length: domesticSorted().length }, () => getRandomColor());
  let border = background().map((color) => changeTransparency(color, 1));
  let hover = background().map((color) => changeTransparency(color, 0.5));

  console.log(defaultData());
  const defaultLabels = defaultData().map((movie) => movie.title);

  function getRandomColor() {
    const randomComponent = () => Math.floor(Math.random() * 256);
    const red = randomComponent();
    const green = randomComponent();
    const blue = randomComponent();
    const alpha = 0.2;
    const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    return color;
  }

  function changeTransparency(rgbaColor, newAlpha) {
    const values = rgbaColor.match(/\d+/g);
    const [red, green, blue, _] = values;
    const newColor = `rgba(${red}, ${green}, ${blue}, ${newAlpha})`;
    return newColor;
  }

  Chart.defaults.color = "white";
  Chart.defaults.borderColor = "lightgrey";
  if (window.innerWidth > 1000) {
    Chart.defaults.font.size = "15";
  } else if (window.innerWidth > 800) {
    Chart.defaults.font.size = "10";
  } else if (window.innerWidth > 600) {
    Chart.defaults.font.size = "8";
  } else if (window.innerWidth < 600) {
    Chart.defaults.font.size = "10";
  }
  let bar;
  if (active === false) {
    bar = new Chart(chart1, {
      type: "bar",
      data: {
        labels: domesticSorted().map((movie) => movie[0]) || defaultLabels,
        datasets: [
          {
            label: "     Domestic Earnings",
            data: domesticSorted().map((movie) => movie[1]) || defaultBox(),
            backgroundColor: "rgba(0, 255, 255, 0.5) ",
            borderColor: "rgb(0, 255, 255)",
            borderWidth: "3",
            borderRadius: "4",
            hoverBackgroundColor: "rgb(0, 255, 255)",
            pointStyle: "star",
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
          onComplete: function (animation) {
            // Add a callback to execute after the animation is complete
            console.log("Animation complete");
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: "Montserrat",
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: true,
            },
            ticks: {
              display: false,
              font: {
                family: "Montserrat", // Your font family
              },
            },
            color: "black",
          },
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              font: {
                family: "Montserrat", // Your font family
              },
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return "$" + value;
              },
            },
          },
        },
      },
    });
  }
  const triggerAnimation = () => {
    if (bar) {
      bar.data.labels =
        domesticSorted().map((movie) => movie[0]) || defaultLabels;
      bar.data.datasets[0].data =
        domesticSorted().map((movie) => movie[1]) || defaultBox();
      bar.update();
    }
  };
  triggerAnimation();

  let genres = [
    ["action", 0],
    ["adventure", 0],
    ["comedy", 0],
    ["drama", 0],
    ["horror", 0],
    ["concert", 0],
    ["documentary", 0],
    ["musical", 0],
    ["romance", 0],
    ["sci-fi", 0],
    ["thriller", 0],
  ];

  const getGenre = (target) => {
    target.forEach((movie) => {
      for (const arr of genres) {
        if (arr[0] === movie.genre) {
          arr[1] += movie.box;
        }
      }
    });
  };

  getGenre(allData());
  const genreResults = genres.filter((genre) => genre[1] > 0);
  console.log(genreResults);

  let pie;
  if (active === false) {
    pie = new Chart(chart2, {
      type: "doughnut",
      data: {
        labels: genreResults.map((movie) => movie[0]) || defaultLabels,
        datasets: [
          {
            label: "     Domestic Earnings",
            data: genreResults.map((movie) => movie[1]) || defaultBox,
            backgroundColor: [
              "rgba(255, 204, 204, 0.5)", // Transparent Light Red
              "rgba(255, 214, 153, 0.5)", // Transparent Light Orange
              "rgba(255, 255, 204, 0.5)", // Transparent Light Yellow
              "rgba(204, 255, 204, 0.5)", // Transparent Light Green
              "rgba(204, 204, 255, 0.5)", // Transparent Light Blue
              "rgba(230, 204, 255, 0.5)", // Transparent Light Purple
              "rgba(255, 217, 235, 0.5)", // Transparent Light Pink
              "rgba(204, 255, 255, 0.5)", // Transparent Light Cyan
              "rgba(216, 245, 204, 0.5)", // Transparent Light Lime
              "rgba(255, 245, 204, 0.5)", // Transparent Light Gold
              "rgba(255, 217, 194, 0.5)", // Transparent Light Coral
            ],
            borderColor: [
              "#FFCCCC", // Light Red
              "#FFD699", // Light Orange
              "#FFFFCC", // Light Yellow
              "#CCFFCC", // Light Green
              "#CCCCFF", // Light Blue
              "#E6CCFF", // Light Purple
              "#FFD9EB", // Light Pink
              "#CCFFFF", // Light Cyan
              "#D8F5CC", // Light Lime
              "#FFF5CC", // Light Gold
              "#FFD9C2", // Light Coral
            ],
            borderWidth: "5",
            hoverBackgroundColor: [
              "#FFCCCC", // Light Red
              "#FFD699", // Light Orange
              "#FFFFCC", // Light Yellow
              "#CCFFCC", // Light Green
              "#CCCCFF", // Light Blue
              "#E6CCFF", // Light Purple
              "#FFD9EB", // Light Pink
              "#CCFFFF", // Light Cyan
              "#D8F5CC", // Light Lime
              "#FFF5CC", // Light Gold
              "#FFD9C2", // Light Coral
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: "Montserrat",

                fontColor: "black",
              },
            },
          },
        },
        scales: {
          width: "100",
          x: {
            display: false,
            grid: {
              display: true,
            },
            ticks: {
              font: {
                family: "Montserrat", // Your font family
              },
            },
          },
          y: {
            display: false,
            beginAtZero: true,
            ticks: {
              font: {
                family: "Montserrat", // Your font family
              },
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return "$" + value;
              },
            },
          },
        },
      },
    });
  } else {
    function triggerAnimation2() {
      if (pie) {
        // bar.data.labels = domesticSorted().map(movie => movie[0]) || (defaultLabels)
        // bar.data.datasets[0].data = domesticSorted().map(movie => movie[1]) || (defaultBox());
        pie.data.labels =
          genreResults.map((movie) => movie[0]) || defaultLabels;
        pie.data.datasets[0].data =
          genreResults.map((movie) => movie[1]) || defaultBox;
        // scat.data[0].datasets =

        pie.update();
      }
    }
    triggerAnimation2();
  }

  const scat = document.getElementById("scatter").getContext('2d');
  const criticDat = [];
  const audDat = [];
  allData().forEach((movie) => {
    audDat.push([movie.veiwer, movie.box]);
  });
  allData().forEach((movie) => {
    criticDat.push([movie.critic, movie.box]);
  });
  console.log(audDat);
  console.log(criticDat);

  let scatt;
  if (active === false) {
    scatt = new Chart(scat, {
      type: "scatter",
      data: {
        labels: "",
        datasets: [
          {
            label: "    Critic",
            data: criticDat,
            backgroundColor: "rgba(211, 211, 211, 0.5)",
            borderColor: "lightgrey",
          },
          {
            label: "    Audience",
            data: audDat,
            backgroundColor: "rgba(0, 0, 255, 0.5)",
            borderColor: "blue",
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: "Montserrat",
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
            },
            ticks: {
              font: {
                family: "Montserrat",
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                family: "Montserrat",
              },

              callback: function (value, index, values) {
                return "$" + value;
              },
            },
          },
        },
      },
    });
  }

  active = true;
};
