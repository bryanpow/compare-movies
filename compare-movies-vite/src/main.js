
import { handleRouting } from './router.js';
import Chart from 'chart.js/auto'
import defaultMov from './movie-data.json';
let form = document.getElementById('movieForm');
const title = document.getElementById('title');
const button = document.getElementById('titleSub');
import {getCard, setCard, addCard, removeCard, getDefault,setDefault, addDefault, removeDef} from './localStorage'
let titleData = null;

const apiKey =  import.meta.env.VITE_API_KEY;
 console.log(apiKey)
function sanitizeInput(input) {
    // Replace HTML special characters with their entities
    return input.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

let seClicked = false;
const handleSettings = () => {
        if (!seClicked){
            seClicked = true
            document.getElementById('restoreDefault').style.height = '100%';
            document.getElementById('restoreDefault').style.opacity = '1';
            document.getElementById('restoreDefault').style.transform = 'translateY(0px)';
            document.getElementById('se').innerText = 'Settings ↑'
           
            document.getElementById('clearDef').style.height = '100%';
            document.getElementById('clearDef').style.opacity = '1';
            document.getElementById('clearDef').style.transform = 'translateY(0px)';
           
        } else {
            seClicked = false;
            document.getElementById('restoreDefault').style.height = '0';
            document.getElementById('restoreDefault').style.opacity = '0';
            document.getElementById('restoreDefault').style.transform = 'translateY(-10px)';
            document.getElementById('se').innerText = 'Settings ↓'
            document.getElementById('clearDef').style.height = '0';
            document.getElementById('clearDef').style.opacity = '0';
            document.getElementById('clearDef').style.transform = 'translateY(-10px)';
        } 
}

document.getElementById('se').addEventListener('click', handleSettings)


document.addEventListener('DOMContentLoaded', handleRouting)
const movieSection = document.getElementById('display-movies')
const addedMovies = new Set();

if (!getCard) setCard([]);

const getMovie = async (event) => {
    apiKey = '191759f3'
    let url = `http://www.omdbapi.com/?apikey=${apiKey}3&&t=${titleData}`;
    const response = await fetch(url);
    const jsonResponse = await response.json()
    console.log(jsonResponse['Response']);
    if (jsonResponse['Response'] === 'True') {
        const img = jsonResponse['Poster']
    localStorage.setItem(`Image`, img);
    if (jsonResponse['Title']) {
        title.value = jsonResponse['Title']
    }
    if (jsonResponse['Ratings'].length > 1) {
        document.getElementById('critic').value = jsonResponse['Ratings'][1]['Value'].replace(/%/g, '');
        document.getElementById('audience').value = parseFloat(jsonResponse['Ratings'][0]['Value'].split('/')[0] * 10);
    } else {
        document.getElementById('critic').value = null;
        document.getElementById('audience').value = null
    }
    
    if (jsonResponse['BoxOffice'] !== 'N/A') {
        document.getElementById('box').value = jsonResponse['BoxOffice']
    } else {
        document.getElementById('box').value = 'null'
    }
    const movieSection = document.getElementById('display-movies');
    } else {
        localStorage.setItem(`Image`, 'https://viterbi-web.usc.edu/~zexunyao/itp301/Assignment_07/img.jpeg');
        console.log('Hello World');
        form.style.display='none';
        const parent = form.parentNode;
        const notFound = document.createElement('p');
        notFound.setAttribute('id', 'notFound');
        notFound.innerHTML = 'Movie not found. Check spelling or insert your own data';
        parent.insertBefore(notFound,form)
        setTimeout(() => {
            document.getElementById('notFound').remove()
            form.style.display = 'flex'
        },3000)
    }



const addMovie = async (event) => {
    
    const tit = title.value;
    event.preventDefault();
    const cardStore = {
        img: localStorage.getItem('Image'),
        title: tit,
        critic: sanitizeInput(document.getElementById('critic').value),
        veiwer: sanitizeInput(document.getElementById('audience').value),
        box: parseFloat(sanitizeInput(document.getElementById('box').value).replace(/[^0-9.-]+/g, '')),
        genre: document.getElementById('genre').value
    }
    
   const movieCard =  document.createElement('div');
     movieCard.classList.add('card');

    movieCard.innerHTML = 
`<div id=${Math.floor(Math.random() * 1393939300303033)} class='cardInfo'>
<p class='divtitle' style='font-weight:bold; padding-top: 5px'>${sanitizeInput(title.value)}</p>
<p>Critic-score: ${sanitizeInput(document.getElementById('critic').value)}%</p>
<p>Viewer-score: ${sanitizeInput(document.getElementById('audience').value)}%</p>
<p>Box-Office: ${sanitizeInput(document.getElementById('box').value)}</p>
<p>Genre: ${sanitizeInput(document.getElementById('genre').value)}</p>
</div>

<img src = ${localStorage.getItem('Image')} width='100%' height='100%' class='cardPicture'>
`
const firstChild = movieSection.firstChild;
    if (!addedMovies.has(tit)) {
        movieSection.insertBefore(movieCard, firstChild);
             addCard(cardStore);

    setTimeout(() => {
       movieCard.classList.add('loaded');

   }, 10)
     movieCard.addEventListener('dblclick', () => {
        movieSection.removeChild(movieCard);
         removeCard(tit);

    });
     addedMovies.add(tit);
    console.log(addedMovies)
    }
    setTimeout(() =>  {
        form.reset();
        localStorage.setItem(`Image`, 'https://viterbi-web.usc.edu/~zexunyao/itp301/Assignment_07/img.jpeg')
    }, 100)
            
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

        const apiKey = '191759f3';
        let url = `http://www.omdbapi.com/?apikey=${apiKey}3&&t=${titleData}`;
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
 const restoreDef = async () => {
    location.reload();
    setCard([])
    await saveDefault();
    
   
 };
 const clearDef = async () =>  {
    setDefault([]);
    location.reload()
 }
 document.getElementById('clearDef').addEventListener('click', clearDef)
 document.getElementById('restoreDefault').addEventListener('click',restoreDef)
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
document.addEventListener('DOMContentLoaded', loadAdd);

let dropActive = false;
document.getElementById('dro').addEventListener('click', () => {
            if(!dropActive){
                dropActive = true
                document.getElementById('aa').style.visibility ='visible';
                document.getElementById('aa').style.opacity ='1';
                document.getElementById('aa').style.transform ='translateY(120px)';
            }else if (dropActive) {
                dropActive = false
                document.getElementById('aa').style.visibility ='hidden';
                document.getElementById('aa').style.opacity ='0';
                document.getElementById('aa').style.transform ='translateY(85px)';
            }
})
let settingsActive = false
document.getElementById('sett').addEventListener('click', () => {
    const clear = document.getElementById('clearDef2');
    const restore = document.getElementById('restoreDefault2');
    if (!settingsActive) {
        settingsActive = true;
        clear.style.display = 'flex';
        restore.style.display = 'flex';
        restore.style.transform = 'translateY(1px)'
        clear.style.transform = 'translateY(1px)'
    } else if (settingsActive) {
        settingsActive = false;
        clear.style.display = 'none';
        restore.style.display = 'none';
        restore.style.transform = 'translateY(-15px)'
        clear.style.transform = 'translateY(-15px)'
    }
})

//CHARTS
const chart1 = document.getElementById('bar').getContext('2d');
const chart2 =document.getElementById('pie').getContext('2d')
const defaultData = getDefault();
const addedData = getCard();
const getBox = (target) => target.map(movie => movie.box)
const defaultBox = getBox(defaultData)
let allDomestic = null;
if (!addedData) allDomestic = (defaultData.map(movie => [movie.title,movie.box]))
else allDomestic = (defaultData.concat(addedData).map(movie => [movie.title,movie.box]));
  

 

console.log(allDomestic)
let  domesticSorted = allDomestic.sort((a,b) => b[1] - a[1]);
if (!getCard) domesticSorted = domestic.sort((a,b) => b[1] - a[1]);
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


  Chart.defaults.color = "white"
  Chart.defaults.borderColor = 'lightgrey'
  if (window.innerWidth > 1000) {
    Chart.defaults.font.size = '15'
  } else if (window.innerWidth > 800){
    Chart.defaults.font.size = '10'
  } else if (window.innerWidth > 600) {
    Chart.defaults.font.size = '8'
  } else if (window.innerWidth < 600) {
     Chart.defaults.font.size = '10'
  }
  
const barChart = new Chart(chart1, {
    type: 'bar',
    data: {
        labels: domesticSorted.map(movie => movie[0]) || (defaultLabels),
        datasets: [{
            label: '     Domestic Earnings',
            data: domesticSorted.map(movie => movie[1]) || (defaultBox),
            backgroundColor: 'rgba(0, 255, 255, 0.5) ',
            borderColor: 'rgb(0, 255, 255)',
            borderWidth: '3',
            borderRadius: '4',
            hoverBackgroundColor: 'rgb(0, 255, 255)' ,
            pointStyle: 'star',
        }]
    },
    options: {
        maintainAspectRatio: true,
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
                    display: false,
                    font: {
                        family: 'Montserrat', // Your font family
                   
                      
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
            label: '     Domestic Earnings',
            data: genreResults.map(movie => movie[1]) || (defaultBox),
            backgroundColor: [
                'rgba(255, 204, 204, 0.5)',   // Transparent Light Red
                'rgba(255, 214, 153, 0.5)',   // Transparent Light Orange
                'rgba(255, 255, 204, 0.5)',   // Transparent Light Yellow
                'rgba(204, 255, 204, 0.5)',   // Transparent Light Green
                'rgba(204, 204, 255, 0.5)',   // Transparent Light Blue
                'rgba(230, 204, 255, 0.5)',   // Transparent Light Purple
                'rgba(255, 217, 235, 0.5)',   // Transparent Light Pink
                'rgba(204, 255, 255, 0.5)',   // Transparent Light Cyan
                'rgba(216, 245, 204, 0.5)',   // Transparent Light Lime
                'rgba(255, 245, 204, 0.5)',   // Transparent Light Gold
                'rgba(255, 217, 194, 0.5)'    // Transparent Light Coral
              ],
            borderColor: [
                '#FFCCCC', // Light Red
                '#FFD699', // Light Orange
                '#FFFFCC', // Light Yellow
                '#CCFFCC', // Light Green
                '#CCCCFF', // Light Blue
                '#E6CCFF', // Light Purple
                '#FFD9EB', // Light Pink
                '#CCFFFF', // Light Cyan
                '#D8F5CC', // Light Lime
                '#FFF5CC', // Light Gold
                '#FFD9C2'  // Light Coral
              ],
            borderWidth: '5',
            hoverBackgroundColor: [
                '#FFCCCC', // Light Red
                '#FFD699', // Light Orange
                '#FFFFCC', // Light Yellow
                '#CCFFCC', // Light Green
                '#CCCCFF', // Light Blue
                '#E6CCFF', // Light Purple
                '#FFD9EB', // Light Pink
                '#CCFFFF', // Light Cyan
                '#D8F5CC', // Light Lime
                '#FFF5CC', // Light Gold
                '#FFD9C2'  // Light Coral
              ]
           
        }]
    },
    options: {
        
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'Montserrat',
                  
                        fontColor: 'black'
                    }
                }
            }
        },
        scales: {
            width: '100',
            x: {
                
                display: false,
                grid: {
                    display: true
                },
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
         
                    },
                },
            },
            y: {
                display: false,
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Montserrat', // Your font family
                   
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
            label: '    Critic',
            data: criticDat,
            backgroundColor: 'rgba(211, 211, 211, 0.5)',
            borderColor: 'lightgrey'
           
        },
        {
            label: '    Audience',
            data: audDat,
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'blue'
        }
        ]
    },
    options: {
        maintainAspectRatio: true,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'Montserrat',
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
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Montserrat', 
                    },
                    
                    callback: function (value, index, values) {
                        return '$' + value;
                    },
                },
            }
        }
    },

});


















