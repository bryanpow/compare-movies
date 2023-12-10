
import { handleRouting } from './router.js';
import Chart from 'chart.js/auto'
import defaultMov from './movie-data.json';
let form = document.getElementById('movieForm');
const title = document.getElementById('title');
const button = document.getElementById('titleSub');
import {getCard, setCard, addCard, removeCard, getDefault,setDefault, addDefault, removeDef} from './localStorage'
let titleData = null;

document.addEventListener('DOMContentLoaded', handleRouting)
const movieSection = document.getElementById('display-movies')
const addedMovies = new Set()
if (!getCard) setCard([]);

const getMovie = async (event) => {
    let url = `http://www.omdbapi.com/?apikey=191759f3&&t=${titleData}`;
    const response = await fetch(url);
    const jsonResponse = await response.json()
    console.log(jsonResponse);
    const img = jsonResponse['Poster']
    localStorage.setItem(`Image`, img);
    if (jsonResponse['Title']) {
        title.value = jsonResponse['Title']
    }
    if (jsonResponse['Ratings'].length > 1) {
        document.getElementById('critic').value = jsonResponse['Ratings'][1]['Value'].replace(/%/g, '');
        document.getElementById('audience').value = parseFloat(jsonResponse['Ratings'][0]['Value'].split('/')[0] * 10);
    } else {
        document.getElementById('critic').placeholder = 'enter';
        document.getElementById('audience').placeholder = 'enter'
    }
    
    if (jsonResponse['BoxOffice'] !== 'N/A') {
        document.getElementById('box').value = jsonResponse['BoxOffice']
    } else {
        document.getElementById('box').placeholder = 'enter'
    }
    const movieSection = document.getElementById('display-movies');




const addMovie = async (event) => {
    const tit = title.value;
    event.preventDefault();
    const cardStore = {
        img: localStorage.getItem('Image'),
        title: tit,
        critic: document.getElementById('critic').value,
        veiwer: document.getElementById('audience').value,
        box: parseFloat(document.getElementById('box').value.replace(/[^0-9.-]+/g, '')),
        genre: document.getElementById('genre').value
    }
    
   const movieCard =  document.createElement('div');
     movieCard.classList.add('card');

    movieCard.innerHTML = 
`<div id=${Math.floor(Math.random() * 1393939300303033)} class='cardInfo'>
<p class='divtitle' style='font-weight:bold; padding-top: 5px'>${title.value}</p>
<p>Critic-score: ${document.getElementById('critic').value}%</p>
<p>Viewer-score: ${document.getElementById('audience').value}%</p>
<p>Box-Office: ${document.getElementById('box').value}</p>
<p>Genre: ${document.getElementById('genre').value}</p>
</div>

<img src = ${localStorage.getItem('Image')} width='100%' height='100%' class='cardPicture'>
`
const firstChild = movieSection.firstChild;
    if (!addedMovies.has(tit)) {
        movieSection.insertBefore(movieCard, firstChild);
        addCard(cardStore)
    setTimeout(() => {
       movieCard.classList.add('loaded');

   }, 10)
     movieCard.addEventListener('dblclick', () => {
        movieSection.removeChild(movieCard);
        removeCard(tit)
    });
     addedMovies.add(tit);
    console.log(addedMovies)
    }

}
document.getElementById('formSub').addEventListener('click', addMovie)
}

button.addEventListener('click',(event) => {
    document.getElementById('critic').value = '';
    document.getElementById('audience').value = '';
    document.getElementById('box').value = ''
    event.preventDefault();
    titleData = title.value;
    getMovie();
   
})



const saveDefault = async () => {
    const jMovies = defaultMov;
    localStorage.removeItem('default')
    for(const movie of jMovies) {
        let url = `http://www.omdbapi.com/?apikey=191759f3&&t=${movie.title}`;
        const response =  await fetch(url);
        const jsonResponse = await response.json()
        console.log(jsonResponse);
        const cardStore = {
            img: jsonResponse['Poster'],
            title: movie.title,
            critic: movie.criticScore,
            veiwer: movie.audienceScore,
            box: movie.domestic,
            genre: movie.genre
        }
        
     addDefault(cardStore)
    }
    
}



 const renderDef = async () => {
    if (!getDefault()) {
        const def = await saveDefault();
        console.log(def)
    }
  
    const defaultSaved = localStorage.getItem('default')
    const defaults = getDefault()
    console.log(defaults)
     defaults.forEach((card) => {
        const img = card.img;
    const movieCard =  document.createElement('div');
       movieCard.classList.add('card')

    movieCard.innerHTML = 
    `<div class='cardInfo'>
    <p class='titleVal' style='font-weight:bold; padding-top: 5px'>${card.title}</p>
    <p class='criticVal'>Critic-score: ${card.critic}%</p>
    <p class='veiwerVal'>Viewer-score: ${card.veiwer}%</p>
    <p class='boxVal'>Box-Office: ${card.box.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }).split('.')[0]}</p>
    <p class='genreVal'>Genre:    ${card.genre}</p>
    </div>

    <img src = ${img} width='100%' height='100%' class='cardPicture'>
    `
    // console.log(movieCard);
    // console.log(movieCard)
     const first = movieSection.appendChild(movieCard);
     setTimeout(() => {
        movieCard.classList.add('loaded');
    }, 150);
    movieCard.addEventListener('dblclick', () => {
        movieSection.removeChild(movieCard);
        removeDef(card.title);
        console.log('done')
    });

    }) 
   
 }
 const loadAdd = async () => {
     await renderDef();
    const history = await getCard();
    console.log(history);

    history.forEach((card) => {
        const img = card.img;
    const movieCard =  document.createElement('div');
    movieCard.classList.add('card')

    movieCard.innerHTML = 
    `<div class='cardInfo'>
    <p class='titleVal' style='font-weight:bold; padding-top: 10px'>${card.title}</p>
    <p class='criticVal'>Critic-score: ${card.critic}%</p>
    <p class='veiwerVal'>Viewer-score: ${card.veiwer}%</p>
    <p class='boxVal'>Box-Office:  ${card.box.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      }).split('.')[0]}</p>
    <p class='genreVal'>Genre: ${card.genre}</p>
    </div>

    <img src = ${img} width='100%' height='100%' class='cardPicture'>
    `
    // console.log(movieCard);
    // console.log(movieCard)
    const firstChild = movieSection.firstChild;
    movieSection.insertBefore(movieCard, firstChild);
     setTimeout(() => {
        movieCard.classList.add('loaded');
    }, 150);
    movieCard.addEventListener('dblclick', () => {
        movieSection.removeChild(movieCard);
        removeCard(card.title)
    });

    }) 
 }
// document.addEventListener('DOMContentLoaded', loadDef)
document.addEventListener('DOMContentLoaded', loadAdd)

//CHARTS
const chart1 = document.getElementById('bar').getContext('2d');
const chart2 =document.getElementById('pie').getContext('2d')
const defaultData = getDefault();
const addedData = getCard();
const getBox = (target) => target.map(movie => movie.box)
const defaultBox = getBox(defaultData)
const allDomestic = (defaultData.concat(addedData).map(movie => [movie.title,movie.box])) || (defaultData.map(movie => [movie.title,movie.box]));
const domesticSorted = allDomestic.sort((a,b) => b[1] - a[1]);
const allData = defaultData.concat(addedData || ([]))
console.log(domesticSorted);
let background = Array.from({ length: domesticSorted.length },() => getRandomColor());
let border = background.map(color => changeTransparency(color, 1))
let hover = background.map(color => changeTransparency(color, 0.5))



console.log(defaultData);
const defaultLabels = defaultData.map(movie => movie.title);


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


  Chart.defaults.color = "black"
  Chart.defaults.borderColor = 'lightgrey'
const barChart = new Chart(chart1, {
    type: 'bar',
    data: {
        labels: domesticSorted.map(movie => movie[0]) || (defaultLabels),
        datasets: [{
            label: 'Domestic Earnings',
            data: domesticSorted.map(movie => movie[1]) || (defaultBox),
            backgroundColor: 'rgba(255,0,0,0.4',
            borderColor: 'rgba(255,0,0,1)',
            borderWidth: '3',
            borderRadius: '4',
            hoverBackgroundColor: 'rgba(255,0,0,0.9' ,
            pointStyle: 'star',
        }]
    },
    options: {
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
            onComplete: function(animation) {
                // Add a callback to execute after the animation is complete
                console.log('Animation complete');
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'Montserrat',
                        size: 20,
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
                        size: 10,
                      
                    },
                },
                color: 'black'
            },
            y: {
                display: true,
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
                        size: 14,
                       
                    },
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return '$' + value;
                    },
                },
            }
        }
    },

});



let genres = [['action', 0], ['adventure',0], ['comedy',0], ['drama',0], ['horror',0],['concert',0], ['documentary',0], ['musical',0], ['romance',0], ['sci-fi',0], ['thriller',0]]


const getGenre = (target) => {
    target.forEach((movie) => {
        for (const arr of genres) {
            if (arr[0] === movie.genre) {
                arr[1] += movie.box
            }
        }
    })
}



  getGenre(allData);
    const genreResults = genres.filter(genre => genre[1] > 0);
    console.log(genreResults)
   


const pieChart = new Chart(chart2, {
    type: 'doughnut',
    data: {
        labels: genreResults.map(movie => movie[0]) || (defaultLabels),
        datasets: [{
            label: 'Domestic Earnings',
            data: genreResults.map(movie => movie[1]) || (defaultBox),
            backgroundColor: hover,
            
            borderWidth: '2',
            hoverBackgroundColor: background
           
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'Montserrat',
                        size: '12%',
                        fontColor: 'black'
                    }
                }
            }
        },
        scales: {
            x: {
                display: false,
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
                        size: 10,
                    },
                },
            },
            y: {
                display: false,
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
                        size: 14,
                    },
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return '$' + value;
                    },
                },
            }
        }
    },

});




const scat = document.getElementById('scatter');
const criticDat = [];
const audDat = [];
allData.forEach(movie => {
    audDat.push([movie.veiwer,movie.box]);
})
allData.forEach(movie => {
    criticDat.push([movie.critic,movie.box]);
})
console.log(audDat);
console.log(criticDat)



const scatter = new Chart(scat, {
    type: 'scatter',
    data: {
        labels: '',
        datasets: [{
            label: 'Critic',
            data: criticDat,
            backgroundColor: 'grey'
           
        },
        {
            label: 'Audience',
            data: audDat,
            backgroundColor: 'lightblue',
            borderColor: 'white'
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'Montserrat',
                        size: 20,
                        fontColor: 'black'
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        family: 'Montserrat', 
                        size: 10,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Montserrat', 
                        size: 14,
                    },
                    
                    callback: function (value, index, values) {
                        return '$' + value;
                    },
                },
            }
        }
    },

});


















