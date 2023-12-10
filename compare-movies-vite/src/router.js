const menu = document.getElementById('landp');
const movies = document.getElementById('moviePage');
const chart = document.getElementById('container');
const foot = document.getElementById('br');


export const handleRouting = async (event) => {
    if (window.location.pathname === '/') {
       movies.style.display = 'none';
        chart.style.display = 'none';
        menu.style.display = 'none';
        menu.style.display = 'flex';
        menu.style.visibility = 'visible'
        foot.style = 'background: linear-gradient(to bottom, #FF5555, #FF4444, #FF4444);'
        foot.style.borderTop = '0';

        
    }else if (window.location.pathname ==='/Movies') {
        document.getElementById('restoreDefault').style.visibility= 'visible'
        menu.style.display = 'none';
        chart.style.display = 'none';
        movies.style.display = 'flex';
        movies.style.visibility = 'visible'
      
    }else if (window.location.pathname === '/Charts') {
        menu.style.display = 'none';
        movies.style.display = 'none';
        chart.style.display = 'flex';
        chart.style.visibility = 'visible'
    }
}