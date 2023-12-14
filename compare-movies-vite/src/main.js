
import { handleHome, handleMovies, handleChart } from './router.js';
import { barChart, pieChart, scatter } from './Chart.js';
import Chart from 'chart.js/auto'
import defaultMov from './movie-data.json';
let form = document.getElementById('movieForm');
const title = document.getElementById('title');
const button = document.getElementById('titleSub');
import {getCard, setCard, addCard, removeCard, getDefault,setDefault, addDefault, removeDef} from './localStorage'
let titleData = null;
const handleNavigation = () => {
    const currentUrl = window.location.pathname;

    if (currentUrl === '/') {
        handleHome();
    } else if (currentUrl === '/Movies') {
        handleMovies();
    } else if (currentUrl === '/Chart') {
        handleChart();
    } else {
       handleHome()
    }
};
barChart();
pieChart();
scatter()
document.addEventListener('DOMContentLoaded', handleNavigation)
window.addEventListener('popstate', handleNavigation)
document.getElementById('logo').addEventListener('click', handleHome);
document.getElementById('ho').addEventListener('click', handleMovies);
document.getElementById('char').addEventListener('click', handleChart);
document.getElementById('start2').addEventListener('click', handleMovies)

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



const movieSection = document.getElementById('display-movies')
const addedMovies = new Set();

if (!getCard) setCard([]);

const getMovie = async (event) => {
    const apiKey = '191759f3'
    let url = `http://www.omdbapi.com/?apikey=${apiKey}&&t=${titleData}`;
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
             barChart();
             pieChart();
             scatter()

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
        const apiKey = '191759f3'
        let url = `http://www.omdbapi.com/?apikey=${apiKey}&&t=${movie.title}`;
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

